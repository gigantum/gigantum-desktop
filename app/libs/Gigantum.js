// @ flow
// vendor
import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import open from 'open';
import pump from 'pump';
import throughJSON from 'through-json';
import through from 'through2';
import uuidv4 from 'uuid/v4';
// config
import Docker from './Docker';
import config from './config';

class Gigantum extends Docker {
  trackedContainer = null;

  runGigantum() {
    this.dockerRequest.get(`/images/${config.imageName}/json`, err => {
      if (err) {
        this.pullGigantum('install');
      } else {
        this.createGigantum();
      }
    });
  }

  start = () => {
    this.trackedContainer
      .start()
      .then(() => {
        this.testPing({
          openPopup: true
        });

        return null;
      })
      .catch(err => {
        if (
          err.json.message.split(':')[
            err.json.message.split(':').length - 1
          ] === ' port is already allocated'
        ) {
          this.uiManager.handleAppEvent({
            toolTip: 'ERROR: Port in use',
            status: 'notRunning',
            id: 'portInUse',
            window: 'portInUse'
          });
        } else {
          this.testPing({
            openPopup: true
          });
        }
      });
  };

  stopProjects = () => {
    const handleContainerList = data => {
      if (data) {
        data.forEach(container => {
          if (
            container &&
            (container.Image.slice(0, 5) === 'gmlb-' ||
              container.Image.slice(0, 10) === 'gmitmproxy')
          ) {
            this.dockerRequest.delete(`/containers/${container.Id}`, {
              qs: {
                force: true
              }
            });
          }
        });
      }
    };

    this.dockerRequest.get(
      '/containers/json',
      {
        qs: {
          all: true
        },
        body: null
      },
      (err, res) => {
        if (err) {
          console.log('err');
        } else {
          pump(res, throughJSON(), through.obj(handleContainerList), error => {
            if (error) {
              console.log(error);
            }
          });
        }
      }
    );
  };

  stopGigantum = () => {
    this.uiManager.changeStatus('closing');
    this.purposelyStopped = true;

    return this.trackedContainer
      .stop()
      .then(container => container.remove())
      .catch(() => true);
  };

  checkApi = (options, attemptCount = 0) => {
    // testPing
    const self = this;
    const apiURL = `http://localhost:10000/api/ping?v=${uuidv4()}`;
    const nextAttempt = attemptCount + 1;
    // setTimeout is used due to a bug during runtime
    setTimeout(() => {
      if (attemptCount < 60) {
        return fetch(apiURL, {
          method: 'GET'
        })
          .then(res => {
            if (
              res.status === 200 &&
              res.headers.get('content-type') === 'application/json'
            ) {
              if (options.openPopup) {
                open(config.defaultUrl);
              }
              this.uiManager.handleAppEvent({
                toolTip: 'Gigantum is running',
                status: 'running'
              });
              setTimeout(() => {
                if (!this.ranOnce) {
                  this.internetAvailable()
                    .then(() => {
                      // checkForUpdates(this.uiManager, false);
                      console.log(this);
                      return null;
                    })
                    .catch(() => {
                      console.log('internet not available');
                    });
                  this.ranOnce = true;
                }
              }, 2000);
            } else {
              setTimeout(() => {
                self.testPing(options, nextAttempt);
              }, 1000);
            }

            return null;
          })
          .catch(() => {
            setTimeout(() => {
              self.testPing(options, nextAttempt);
            }, 1000);
          });
      }

      this.inspectGigantum()
        .then(res => {
          if (res && res.State && res.State.Status === 'running') {
            if (options.openPopup) {
              // shell.openExternal(config.defaultUrl);
            }
            this.uiManager.handleAppEvent({
              toolTip: 'Gigantum is running',
              status: 'running'
            });
          } else {
            self.uiManager.handleAppEvent({
              toolTip: 'ERROR: Client Failed To Start',
              status: 'notRunning',
              window: 'failed'
            });
          }

          return null;
        })
        .catch(() => {
          self.uiManager.handleAppEvent({
            toolTip: 'ERROR: Client Failed To Start',
            status: 'notRunning',
            window: 'failed'
          });
        });
    }, 0);
  };

  handleAppQuit(updating = false) {
    if (this.removePreviousVersion && updating) {
      this.removeGigantumImage()
        .then(() => {
          app.quitting = true;

          if (process.platform === 'linux') {
            this.uiManager.destroyTray();
          }
          autoUpdater.quitAndInstall();
          return null;
        })
        .catch(error => {
          console.log(error);
          return error;
        });
    } else if (this.removePreviousVersion) {
      this.removeGigantumImage()
        .then(() => {
          app.quitting = true;
          app.quit();
          return null;
        })
        .catch(error => {
          console.log(error);

          return null;
        });
    } else if (updating) {
      app.quitting = true;
      if (process.platform === 'linux') {
        this.uiManager.destroyTray();
      }
      autoUpdater.quitAndInstall();
    } else {
      app.quitting = true;
      app.quit();
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
    this.inspectGigantum()
      .then(valid => {
        this.purposelyStopped = true;
        if (valid) {
          this.trackedContainer
            .restart()
            .then(() => {
              this.purposelyStopped = false;
              this.testPing({});
              return null;
            })
            .catch(err => {
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

        return null;
      })
      .catch(() => this.runGigantum());
  }

  createGigantum() {
    this.stopLabbooks();
    this.dockerode
      .createContainer(
        Object.assign(config.containerConfig, { name: config.containerName })
      )
      .then(container => {
        this.trackedContainer = container;
        this.startGigantum();
        return null;
      })
      .catch(error => {
        console.log(error);
      });
  }

  pullGigantum(type = 'install', tag = config.imageTag) {
    this.internetAvailable()
      .then(() => {
        if (type === 'install') {
          // this.uiManager.handleAppEvent({
          //   toolTip: 'Gigantum is installing...',
          //   status: 'starting',
          //   id: 'imageNotInstalled',
          //   window: 'install',
          // });
          //
          console.log('update');
        } else {
          // this.uiManager.handleAppEvent({
          //   toolTip: 'Gigantum is updating...',
          //   window: 'update',
          // });

          console.log('update');
        }

        const dataObj = {};
        const extractObj = {};
        let extractInARow = 0;

        const handlePull = (data, enc, cb) => {
          if (data.error) return cb(new Error(data.error.trim()));
          if (
            !data.id ||
            !data.progressDetail ||
            !data.progressDetail.current
          ) {
            return cb();
          }
          let downloadSize = 0;
          let extractSize = 0;
          if (data.status === 'Downloading' && extractInARow < 10) {
            extractInARow = 0;
            dataObj[data.id] = {
              transferred: data.progressDetail.current,
              total: data.progressDetail.total,
              iterationsUnmodified: -1
            };
            Object.keys(dataObj).forEach(layer => {
              if (dataObj[layer].transferred) {
                if (dataObj[layer].iterationsUnmodified < 10) {
                  downloadSize += dataObj[layer].transferred;
                } else {
                  downloadSize += dataObj[layer].total;
                }
                dataObj[layer].iterationsUnmodified += 1;
              }
            });
            this.uiManager.updateInstallImageWindow({ downloadSize }, type);
          } else if (data.status === 'Extracting') {
            extractInARow += 1;
            if (!extractObj[data.id]) {
              extractObj[data.id] = {
                transferred: data.progressDetail.current
              };
            } else {
              extractObj[data.id] = {
                transferred:
                  data.progressDetail.current > extractObj[data.id].transferred
                    ? data.progressDetail.current
                    : extractObj[data.id].transferred
              };
            }
            if (extractInARow > 10) {
              Object.keys(extractObj).forEach(layer => {
                if (extractObj[layer].transferred) {
                  extractSize += extractObj[layer].transferred;
                }
              });
              Object.keys(dataObj).forEach(layer => {
                if (dataObj[layer].transferred) {
                  downloadSize += dataObj[layer].total;
                }
              });
              this.uiManager.updateInstallImageWindow(
                { downloadSize, extractSize, doneDownloading: true },
                type
              );
            }
          }
          cb();
        };
        this.dockerRequest.post(
          '/images/create',
          {
            qs: {
              fromImage: config.imageName,
              tag
            },
            body: null
          },
          (err, response) => {
            if (response) {
              pump(response, throughJSON(), through.obj(handlePull), error => {
                if (error) {
                  console.log(error);
                }
                if (type === 'update' && this.electronAppDownloaded) {
                  this.uiManager.updateInstallImageWindow(
                    { isDownloaded: true },
                    'update'
                  );
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
            } else {
              this.uiManager.handleAppEvent({
                toolTip: 'ERROR: Docker is not running',
                status: 'notRunning',
                id: 'dockerNotRunning',
                window: 'docker'
              });
            }
          }
        );

        return null;
      })
      .catch(() => {
        if (type === 'install') {
          this.uiManager.handleAppEvent({
            toolTip: 'Gigantum is not running.',
            status: 'notRunning'
          });
        }
        dialog.showMessageBox({
          title: `Unable to ${type} Gigantum Client.`,
          message: `A valid internet connection must be established to ${type} the Gigantum Client.`,
          buttons: ['Close']
        });
      });
  }

  removeGigantumImage() {
    const images = `/images/${config.imageName}`;

    return this.stopGigantum()
      .then(() => this.stopLabbooks())
      .then(() =>
        this.dockerRequest.delete(images, err => {
          if (err) {
            console.log(err);
          }
        })
      );
  }
}

export default Gigantum;
