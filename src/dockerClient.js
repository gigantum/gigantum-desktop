import path from 'path';
import fs from 'fs';
import os from 'os';
import Dockerode from 'dockerode';
import {
  shell,
  app,
  dialog,
} from 'electron';
import fetch from 'node-fetch';
import DockerApi from 'docker-remote-api';
import pump from 'pump';
import throughJSON from 'through-json';
import through from 'through2';
import {autoUpdater} from 'electron-updater'
import internetAvailable from 'internet-available'

import checkForUpdates from './updater';
import config from './config';

export default class GigDockerClient {
  constructor() {
    this.attemptingReconnect = false;
    this.testPing = this.testPing.bind(this);
    this.purposelyStopped = false;
    this.removePreviousVersion = false;
    this.ranOnce = false;

    // I'm duplicating option dictionaries for now, as there are mildly
    // incompatible syntaxes
    this.dockerodeOptions = {
      version: 'v1.37',
    };

    if (process.platform === 'win32') {
      this.dockerodeOptions.socketPath = '//./pipe/docker_engine';
      // This works, on windows only if "without TLS" is enabled
      // this.dockerOptions.host = '127.0.0.1:2375';
    }
    else {
      // Not clear if DOCKER_SOCKET can be anything else on windows
      // So, only including this logic here for now
      const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
      this.dockerodeOptions.socketPath = socket;
    }
    this.dockerode = Dockerode(this.dockerOptions);

    this.dockerOptions = {
      version: 'v1.37',
    };
    if (process.platform === 'win32') {
      this.dockerOptions.host = '//./pipe/docker_engine';
      // This works, on windows only if "without TLS" is enabled
      // this.dockerOptions.host = '127.0.0.1:2375';
    }
    // else docker-remote-api will set to the default of /var/run/docker.sock

    this.updatedImageDownloaded = false;
    this.electronAppDownloaded = false;
    this.dockerRequest = new DockerApi(this.dockerOptions);
    autoUpdater.on('update-downloaded', (info) => {
      this.uiManager.updateInstallImageWindow({ isDownloaded: true }, 'update');
      if (this.updatedImageDownloaded) {
        const tag = info.releaseNotes.split('\n')[2].split(': ')[1].split(' ')[0];
        if (tag !== config.imageTag) {
          this.removePreviousVersion = true;
        }
        this.uiManager.updateReady();
      } else {
        this.electronAppDownloaded = true;
      }
    });
  }

  setupDocker() {
    const self = this;

    const statusList = [
      'stop',
      'kill',
      'unmount',
      'disconnect',
      'die',
    ];
    const appBroke = () => {
      this.uiManager.handleAppEvent({
        toolTip: 'ERROR: Gigantum stopped working',
        status: 'notRunning',
        id: 'containerNotRunning',
      });
    };
    const eventHandler = (data, enc, cb) => {
      if (
        data &&
        statusList.indexOf(data.status) !== -1 &&
        data.from === config.imageName &&
        !this.purposelyStopped
      ) {
        // Something went wrong
        return appBroke();
      }
      if (data.error) return cb(new Error(data.error.trim()));

      cb();
    };

    this.dockerode.getEvents({}).then(
      (response) => {
        pump(response, throughJSON(), through.obj(eventHandler), (error) => {
          if (error) {
            console.log(error);
          }
          self.uiManager.setupApp();
        });
      },
      (err) =>  console.log(err)
    )

    this.dockerode.ping()
    .then(() => {
      if(!this.ranOnce) {
        internetAvailable().then(() => {
          checkForUpdates(this.uiManager, false);
        })
        .catch(() => {
          console.log('internet not available')
        })
        this.ranOnce = true;
      }
      this.attemptingReconnect = false;
      this.ensureLocalContainer();
    })
    .catch((err) => {
      self.uiManager.handleAppEvent({
        toolTip: 'ERROR: Docker is not running',
        status: 'notRunning',
        id: 'dockerNotRunning',
        window: 'docker',
      });
      if (!this.attemptingReconnect) {
        this.attemptingReconnect = true;
        this.dockerReconnect();
      }
    });
  }

  dockerReconnect(reconnectCount = 0) {
    const nextInterval = reconnectCount + 1;
    const self = this;
    return this.dockerode.ping().then(
      () => {
        self.uiManager.setupApp();
      },
      () => {
        setTimeout(() => {
          self.dockerReconnect(nextInterval);
        }, reconnectCount > 180 ? 15 * 1000 : 6 * 1000);
      },
    );
  }

  dockerConnectionTest() {
    return this.dockerode.ping().then(() => true, () => false);
  }

  testPing(options) {
    const self = this;
    //setTimeout is used due to a bug during runtime
    setTimeout(() => {
      return fetch(config.defaultUrl,
        {
          method: 'OPTIONS',
        })
        .then(() => {
          this.uiManager.handleAppEvent({
            toolTip: 'Gigantum is running',
            status: 'running',
          });
          if (options.openPopup) {
            shell.openExternal(config.defaultUrl);
          }
        })
        .catch(() => {
          setTimeout(() => {
            self.testPing(options);
          }, 1000);
        });
    }, 0)
  }

  startGigantum() {
    this.trackedContainer.start()
    .then(() => {
      this.testPing({
        openPopup: true,
      });
    })
    .catch((err) => {
      if (err.json.message.split(':')[err.json.message.split(':').length - 1] === ' port is already allocated') {
        this.uiManager.handleAppEvent({
          toolTip: 'ERROR: Port in use',
          status: 'notRunning',
          id: 'portInUse',
          window: 'portInUse',
        });
      } else {
        this.testPing({
          openPopup: true,
        });
      }
    });
  }

  stopLabbooks() {
    const handleContainerList = (data) => {
      if (data) {
        data.forEach((container) => {
          if (container && container.Image.slice(0, 5) === 'gmlb-') {
            this.dockerRequest.delete(`/containers/${container.Id}`,
              {
                qs: {
                  force: true,
                },
              });
          }
        });
      }
    };

    this.dockerRequest.get(
      '/containers/json',
      (err, res) => {
        if (err) {
          console.log('err');
        } else {
          pump(res, throughJSON(), through.obj(handleContainerList), (error) => {
            if (error) {
              console.log(error);
            }
          });
        }
      });
  }

  stopGigantum() {
    this.uiManager.changeStatus('closing');
    this.purposelyStopped = true;

    return this.trackedContainer.stop()
    .then((container) => {
      return container.remove();
    })
    .catch(() => true);
  }

  handleAppQuit(updating = false) {

    if(this.removePreviousVersion && updating) {
      this.removeGigantumImage()
      .then(() => {
        this.dockerRequest.post('/containers/prune', {body: null}, (err, res) =>{
          app.quitting = true;
          if(process.platform === 'linux'){
            this.uiManager.destroyTray();
          }
          autoUpdater.quitAndInstall();
        })
      })
    } else if(this.removePreviousVersion) {
      this.removeGigantumImage()
      .then(() => {
        this.dockerRequest.post('/containers/prune', {body: null}, (err, res) =>{
          app.quitting = true;
          app.quit();
        })
      })
    } else if (updating) {
      this.dockerRequest.post('/containers/prune', {body: null}, (err, res) =>{
        app.quitting = true;
        if(process.platform === 'linux'){
          this.uiManager.destroyTray();
        }
        autoUpdater.quitAndInstall();
      })
    } else {
      this.dockerRequest.post('/containers/prune', {body: null}, (err, res) =>{
        app.quitting = true;
        app.quit();
      });
    }
  }

  inspectGigantum() {
    if (this.trackedContainer) {
      return this.trackedContainer.inspect();
    }
    return Promise.reject(new Error());
  }

  restartGigantum() {
    this.uiManager.changeStatus('starting');
    this.uiManager.restartingEnabled(false);
    this.inspectGigantum().then((valid) => {
      this.purposelyStopped = true;
      if (valid) {
        this.trackedContainer
          .restart()
          .then(() => {
            this.purposelyStopped = false;
            this.testPing({});
          })
          .catch((err) => {
            this.purposelyStopped = false;
            if (
              err.json &&
              err.json.message.split(':')[
                err.json.message.split(':').length - 1
              ] === ' port is already allocated'
            ) {
              this.uiManager.setupApp();
            } else {
              this.testPing({});
            }
          });
        this.runGigantum();
      }
    })
    .catch(() => this.runGigantum());
  }

  createGigantum() {
    this.stopLabbooks();
    this.dockerode.createContainer(Object.assign(config.containerConfig, { name: config.containerName }))
    .then((container) => {
      this.trackedContainer = container;
      this.startGigantum();
    })
    .catch(() => {});
  }

  pullGigantum(type = 'install', tag = config.imageTag) {
    internetAvailable().then(() => {
      if (type === 'install') {
        this.uiManager.handleAppEvent({
          toolTip: 'Gigantum is installing...',
          status: 'starting',
          id: 'imageNotInstalled',
          window: 'install',
        });
      } else {
        this.uiManager.handleAppEvent({
          toolTip: 'Gigantum is updating...',
          window: 'update',
        });
      }
      const dataObj = {};
      const extractObj = {};
      let extractInARow = 0;
      const handlePull = (data, enc, cb) => {
        if (data.error) return cb(new Error(data.error.trim()));
        if (!data.id || !data.progressDetail || !data.progressDetail.current) {
          return cb();
        }
        let downloadSize = 0;
        let extractSize = 0;
        if (data.status === 'Downloading' && extractInARow < 10) {
          extractInARow = 0;
          dataObj[data.id] = {
            transferred: data.progressDetail.current,
            total: data.progressDetail.total,
            iterationsUnmodified: -1,
          };
          Object.keys(dataObj).forEach((layer) => {
            if (dataObj[layer].transferred) {
              if (dataObj[layer].iterationsUnmodified < 10) {
                downloadSize += dataObj[layer].transferred;
              } else {
                downloadSize += dataObj[layer].total;
              }
              dataObj[layer].iterationsUnmodified += 1;
            }
          });
          this.uiManager.updateInstallImageWindow(
            { downloadSize },
            type,
          );
        } else if (data.status === 'Extracting') {
          extractInARow += 1;
          if (!extractObj[data.id]) {
            extractObj[data.id] = {
              transferred: data.progressDetail.current,
            };
          } else {
            extractObj[data.id] = {
              transferred: data.progressDetail.current > extractObj[data.id].transferred ? data.progressDetail.current : extractObj[data.id].transferred,
            };
          }
          if (extractInARow > 10) {
            Object.keys(extractObj).forEach((layer) => {
              if (extractObj[layer].transferred) {
                extractSize += extractObj[layer].transferred;
              }
            });
            Object.keys(dataObj).forEach((layer) => {
              if (dataObj[layer].transferred) {
                downloadSize += dataObj[layer].total;
              }
            });
            this.uiManager.updateInstallImageWindow(
              { downloadSize, extractSize, doneDownloading: true },
              type,
            );
          }
        }
        cb();
      };
      this.dockerRequest.post(
        '/images/create', {
          qs: {
            fromImage: config.imageName,
            tag,
          },
          body: null,
        },
        (err, response) => {
          if (err) {
            console.log(err);
          }
          pump(response, throughJSON(), through.obj(handlePull), (error) => {
            if (error) {
              console.log(error);
            }
            if (type === 'update' && this.electronAppDownloaded) {
              this.uiManager.updateInstallImageWindow({ isDownloaded: true }, 'update');
              if (tag !== config.imageTag) {
                this.removePreviousVersion = true;
              }
              this.uiManager.updateReady();
            } else if (type !== 'update') {
              this.uiManager.setupApp();
            } else {
              this.updatedImageDownloaded = true;
            }
          });
        },
      );
    })
    .catch(() => {
      if (type === 'install') {
        this.uiManager.handleAppEvent({
          toolTip: 'Gigantum is not running.',
          status: 'notRunning',
        });
      }
      dialog.showMessageBox({
        title: `Unable to ${type} Gigantum Client.`,
        message: `A valid internet connection must be established to ${type} the Gigantum Client.`,
      });
    })
  }

  removeGigantumImage() {
    return this.stopGigantum()
    .then(() => this.stopLabbooks())
    .then(() => this.dockerRequest.delete(
        `/images/${config.imageName}`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }));
  }

  runGigantum() {
    this.dockerRequest.get(
      `/images/${config.imageName}/json`,
      (err) => {
        if (err) {
          this.pullGigantum('install');
        } else {
          this.createGigantum();
        }
      });
  }

  ensureLocalContainer() {
    this.hostWorkingDir = path.join(os.homedir(), 'gigantum');

    try {
      fs.mkdirSync(this.hostWorkingDir);
    } catch (err) {
      //
    }

    this.dockerRequest.post('/containers/prune', { body: null }, (err, res) => {
      pump(res, throughJSON(), through.obj(null), (error) => {
        if (error) {
          console.log(error);
        }

        const container = this.dockerode.getContainer(config.containerName);
        container.inspect().then((resContainer) => {
          this.trackedContainer = container;
          if (resContainer.Config.Image === config.imageName) {
            this.testPing({
              openPopup: true,
            });
          } else {
            this.stopGigantum()
              .then(() => this.stopLabbooks())
              .then(() => this.runGigantum());
          }
        })
        .catch(() => {
          this.runGigantum();
        });
      });
    });
  }

  setUiManager(uiManager) {
    this.uiManager = uiManager;
  }
}
