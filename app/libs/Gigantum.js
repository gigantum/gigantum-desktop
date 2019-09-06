// @ flow
// vendor
import { app, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';
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

  constructor(props) {
    super(props);
    this.init();
  }

  /**
    @param {} -
    init for docker
  */
  init = () => {
    try {
      fs.mkdirSync(this.hostWorkingDir);
    } catch (err) {
      console.log(err);
    }
  };

  /**
    @param {Function} callback
    @param {Boolean} skipStart
    runs getContainer and checks if the container exists
    @calls {this.getContainer}
  */
  runGigantum = (callback, skipStart) => {
    this.dockerRequest.get(`/images/${config.imageName}/json`, error => {
      if (error) {
        callback({
          success: false,
          running: false,
          error
        });
      } else if (skipStart) {
        callback({
          success: true
        });
      } else {
        this.createGigantum(callback);
      }
    });
  };

  /**
    @param {Function} callback
    creates container and passes container back to start callback
    @calls {dockerode.createContainer}
  */
  createGigantum(callback) {
    this.stopProjects();
    this.dockerode
      .createContainer(
        Object.assign(config.containerConfig, { name: config.containerName })
      )
      .then(gigantumContainer => {
        callback({ success: true, running: false, gigantumContainer });
        return null;
      })
      .catch(error => {
        console.log(error);
      });
  }

  /**
    @param {Function} callback
    runs getContainer and checks if the container exists
    @calls {dockerode.getContainer}
  */
  start = callback => {
    console.log(callback);

    const getContainerCallback = response => {
      if (!response.running && response.success) {
        response.gigantumContainer
          .start()
          .then(() => {
            this.checkApi(callback, { openPopup: true });

            return null;
          })
          .catch(error => {
            console.log(error);
            const errorMessage = error.json.message.split(':')[
              error.json.message.split(':').length - 1
            ];

            if (errorMessage === ' port is already allocated') {
              callback({ success: false, error: error.json });
            } else {
              this.checkApi(callback, { openPopup: true });
            }
          });
      } else {
        callback(response);
      }
    };

    this.getContainer(getContainerCallback);
  };

  /**
    @param {Function} callback
    stops and cleansup gigantum
  */
  stop = callback => {
    this.stopGigantum()
      .then(() => this.stopProjects())
      .then(() =>
        this.dockerRequest.delete(`/containers/${config.containerName}`, () => {
          callback({ success: true, data: {} });
          return null;
        })
      )
      .catch(error => callback({ success: false, error }));
  };

  /**
    @param {Function} callback
    runs getContainer and checks if the container exists
    @calls {dockerode.getContainer}
  */
  getContainer = callback => {
    const { getContainer } = this.dockerode;
    const container = getContainer(config.containerName);

    container.modem = this.dockerode.modem;

    container.inspect((err, gigantumContainer) => {
      if (err) {
        this.runGigantum(callback);
      } else {
        this.handleGigantumState(gigantumContainer, callback);
      }
    });
  };

  /**
    @param {Object} gigantumContainer
    @param {Function} callback
    checks if gigantum is running
  */
  handleGigantumState = (gigantumContainer, callback) => {
    if (
      gigantumContainer.Config.Image === config.imageName &&
      gigantumContainer.State.Running
    ) {
      this.checkApi(callback, { openPopup: true });
    } else {
      this.cleanUp(callback);
    }
  };

  /**
    @param {Object} callback
    checks if gigantum is running
  */
  checkGigantumRunning = callback => {
    const { getContainer } = this.dockerode;
    const container = getContainer(config.containerName);

    container.modem = this.dockerode.modem;

    container.inspect((err, gigantumContainer) => {
      if (err) {
        callback({ success: false });
      }
      if (
        gigantumContainer &&
        gigantumContainer.Config.Image === config.imageName &&
        gigantumContainer.State.Running
      ) {
        callback({ success: true });
      } else {
        callback({ success: false });
      }
    });
  };

  /**
    @param {Object}
    @param {Function} callback
    stops gignatum
    stops gignatum projects
    removes gigantum container
    starts gigantum
  */
  cleanUp = callback => {
    this.stopGigantum()
      .then(() => this.stopProjects())
      .then(() =>
        this.dockerRequest.delete(
          `/containers/${config.containerName}`,
          err => {
            if (err) {
              console.log(err);
            }
            this.runGigantum(callback);
          }
        )
      )
      .catch(() => this.runGigantum(callback));
  };

  /**
    @param {Function} callback
    @param {Boolean} skipDelete
    prunes running gigantum projects
  */
  stopProjects = (callback, skipDelete) => {
    const handleContainerList = data => {
      let success = true;
      if (data) {
        data.forEach(container => {
          if (
            container &&
            (container.Image.slice(0, 5) === 'gmlb-' ||
              container.Image.slice(0, 10) === 'gmitmproxy')
          ) {
            if (skipDelete) {
              if (container.State === 'running') {
                success = false;
              }
            } else {
              this.dockerRequest.delete(`/containers/${container.Id}`, {
                qs: {
                  force: true
                }
              });
            }
          }
        });
      }
      if (skipDelete) {
        callback({ success });
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

  /**
    @param {} -
    stops and removes gigantum container
  */
  stopGigantum = () => {
    this.purposelyStopped = true;
    return this.dockerode
      .getContainer(config.containerName)
      .stop()
      .then(container => container.remove())
      .catch(() => true);
  };

  /**
    @param {Function} callback
    @param {Object} options
    @param {Number} attemptCount
    stops and removes container
  */
  checkApi = (callback, options, attemptCount = 0) => {
    const apiURL = `http://localhost:10000/api/ping?v=${uuidv4()}`;
    const nextAttempt = attemptCount + 1;
    // setTimeout is used due to a bug during runtime
    setTimeout(() => {
      if (attemptCount < 60) {
        return fetch(apiURL, {
          method: 'GET'
        })
          .then(data => {
            if (
              data.status === 200 &&
              data.headers.get('content-type') === 'application/json'
            ) {
              if (options.openPopup) {
                open(config.defaultUrl);
              }

              callback({ success: true, running: true, data: {} });
            } else {
              setTimeout(() => {
                this.checkApi(callback, options, nextAttempt);
              }, 1000);
            }
            return null;
          })
          .catch(() => {
            setTimeout(() => {
              this.checkApi(callback, options, nextAttempt);
            }, 1000);
          });
      }
      callback({
        success: false,
        running: false,
        error: {
          message: 'ERROR: Client Failed To Start'
        }
      });
    }, 0);
  };

  /**
   * @param {Function} callback
    restarts gigantum container
  */
  restart = callback => {
    const { getContainer } = this.dockerode;
    const container = getContainer(config.containerName);

    container.modem = this.dockerode.modem;
    container
      .restart()
      .then(() => {
        this.checkApi(callback, {});
        return null;
      })
      .catch(error => {
        if (error.json) {
          callback({ success: false, error: error.json });
        } else {
          this.checkApi(callback, {});
        }
      });
  };

  /**
   * @param {Function} callback
    fetches image data
  */
  fetchImageData = callback => {
    fetch(
      `https://hub.docker.com/v2/repositories/gigantum/labmanager/tags/${config.imageTag}`
    )
      .then(response => response.json())
      .then(response => callback({ success: true, data: response }))
      .catch(error => callback({ sucess: false, error }));
  };

  /**
   * @param {Function} callback
    pulls Gigantum image
  */
  pullImage = (callback, imageData) => {
    console.log('this ran');
    const { tag, name, size } = imageData;
    const downloadObj = { null: 0 };
    const extractObj = { null: 0 };
    const currentImageSize = size || this.imageSize;
    const processPercent = obj =>
      Object.values(obj).reduce((a, b) => a + b) / currentImageSize;
    const handlePull = (data, enc, cb) => {
      if (data.error) return cb(new Error(data.error.trim()));
      if (!data.id || !data.progressDetail || !data.progressDetail.current) {
        return cb();
      }
      if (data.status === 'Downloading') {
        downloadObj[data.id] = data.progressDetail.current;
      } else if (data.status === 'Extracting') {
        extractObj[data.id] = data.progressDetail.current;
      }
      const downloadPercent = processPercent(downloadObj);
      const extractPercent = processPercent(extractObj);

      const weightedDownloadPercent = downloadPercent * 75;
      const weightedExtractPercent = extractPercent * 25;
      callback({
        success: true,
        data: {
          percentage: weightedDownloadPercent + weightedExtractPercent,
          finished: false
        }
      });
      cb();
    };
    this.dockerRequest.post(
      '/images/create',
      {
        qs: {
          fromImage: name,
          tag
        },
        body: null
      },
      (err, response) => {
        if (response) {
          pump(response, throughJSON(), through.obj(handlePull), error => {
            if (error) {
              console.log('error ran here');
              console.log(error);
            } else {
              callback({
                success: true,
                data: {
                  percentage: 100,
                  finished: true
                }
              });
            }
          });
        } else {
          setTimeout(() => this.pullImage(callback, imageData), 2000);
        }
        console.log(err, response);
      }
    );
  };

  /**
   * @param {Function} callback
    pulls gigantum container
  */
  configureGigantum = callback => {
    const { getContainer } = this.dockerode;
    console.log('before');
    const container = getContainer(config.containerName);
    console.log('after');

    container.modem = this.dockerode.modem;

    const runGigantumCallback = response => {
      const isNotInstalled =
        response &&
        response.error &&
        response.error.message &&
        response.error.message.indexOf('no such image') > -1;
      if (isNotInstalled) {
        const imageData = {
          name: config.imageName,
          tag: config.imageTag
        };
        this.pullImage(callback, imageData);
      } else if (response && response.error) {
        callback({ success: false, data: response.error });
      } else {
        callback({ success: true, data: { finished: true } });
      }
    };

    const fetchImageDataCallback = response => {
      if (response.success) {
        this.imageSize = response.data.full_size;
        this.runGigantum(runGigantumCallback, true);
      } else {
        callback({ success: false, data: { error: response.error } });
      }
    };

    this.fetchImageData(fetchImageDataCallback);
  };

  /**
   * @param {Function} callback
    checks for gigantumImage
  */
  checkGigantumImage = callback => {
    const runGigantumCallback = response => {
      if (response.success) {
        callback(response);
      } else {
        setTimeout(() => {
          this.checkGigantumImage(callback);
        }, 1000);
      }
    };

    this.runGigantum(runGigantumCallback, true);
  };

  /**
   * @param {Function} callback
    removes outdated gigantum image
  */
  removeGigantumImage = callback => {
    const images = `/images/${config.imageName}`;
    this.stopGigantum()
      .then(() => this.stopProjects())
      .then(() =>
        this.dockerRequest.delete(
          images,
          {
            qs: {
              force: true
            }
          },
          err => {
            if (err) {
              console.log(err);
              callback({ success: false });
            } else {
              callback({ success: true });
            }
          }
        )
      )
      .catch(() => callback({ success: false }));
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
}

export default Gigantum;
