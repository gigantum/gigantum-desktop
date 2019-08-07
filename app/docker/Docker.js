// vendor
import childProcess from 'child_process';
import DockerApi from 'docker-remote-api';
import Dockerode from 'dockerode';
import fs from 'fs';
import os from 'os';
import path from 'path';
import pump from 'pump';
import throughJSON from 'through-json';
import through from 'through2';
// config
import config from './config';
// import storage from '../storage/Storage';
//

/**
  @param {} -
  gets dockerodeOptions
*/
const dockerodeOptions = (() => {
  const options = {
    version: 'v1.37'
  };

  if (process.platform === 'win32') {
    options.socketPath = '//./pipe/docker_engine';
    // This works, on windows only if "without TLS" is enabled
    // dockerOptions.host = '127.0.0.1:2375';
  } else {
    // Not clear if DOCKER_SOCKET can be anything else on windows
    // So, only including this logic here for now
    const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
    options.socketPath = socket;
  }

  return options;
})();

const dockerOptions = (() => {
  const dockerOptionsTemp = {
    version: 'v1.37'
  };

  if (process.platform === 'win32') {
    dockerOptionsTemp.host = '//./pipe/docker_engine';
    // This works, on windows only if "without TLS" is enabled
    // this.dockerOptions.host = '127.0.0.1:2375';
  }

  return dockerOptionsTemp;
})();

class Docker {
  /* set defaults here A-Z */
  attemptingReconnect = false;

  dockerRequest = new DockerApi(dockerOptions);

  dockerode = new Dockerode(dockerodeOptions);

  hostWorkingDir = null;

  trackedContainer = null;

  /* defaults END */

  /**
    @param {} -
    stops the docker application
  */
  ensureLocalContainer = () => {
    this.hostWorkingDir = path.join(os.homedir(), 'gigantum');

    try {
      fs.mkdirSync(this.hostWorkingDir);
    } catch (err) {
      console.log(err);
    }

    const container = this.dockerode.getContainer(config.containerName);
    container
      .inspect()
      .then(resContainer => {
        this.trackedContainer = container;

        if (
          resContainer.Config.Image === config.imageName &&
          resContainer.State.Running
        ) {
          this.testPing({
            openPopup: true
          });
        } else {
          this.stopGigantum()
            .then(() => this.stopProjects())
            .then(() =>
              this.dockerRequest.delete(
                `/containers/${config.containerName}`,
                err => {
                  if (err) {
                    console.log(err);
                  }
                  this.runGigantum();
                }
              )
            )
            .catch(() => this.runGigantum());
        }
        return null;
      })
      .catch(() => {
        this.runGigantum();
      });
  };

  /**
    @param {} -
    stops the docker application
  */
  setupDocker = () => {
    const self = this;

    const statusList = ['stop', 'kill', 'unmount', 'disconnect', 'die'];
    const appBroke = () => {
      // this.uiManager.handleAppEvent({
      //   toolTip: 'ERROR: Gigantum stopped working',
      //   status: 'notRunning',
      //   id: 'containerNotRunning',
      // });
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

    this.dockerode
      .getEvents({})
      .then(
        response => {
          pump(response, throughJSON(), through.obj(eventHandler), error => {
            if (error) {
              console.log(error);
            }
            self.uiManager.setupApp();
          });

          return null;
        },
        err => console.log(err)
      )
      .catch(error => {
        console.log(error);
      });

    this.dockerode
      .ping()
      .then(() => {
        this.attemptingReconnect = false;
        this.ensureLocalContainer();

        return null;
      })
      .catch(err => {
        console.log(err);
        self.uiManager.handleAppEvent({
          toolTip: 'ERROR: Docker is not running',
          status: 'notRunning',
          id: 'dockerNotRunning',
          window: 'docker'
        });

        if (!this.attemptingReconnect) {
          this.attemptingReconnect = true;
          this.dockerReconnect();
        }
      });
  };

  /**
    @param {} -
    starts the docker application
  */
  startDockerApplication = () => {
    const dockerSpawn = childProcess.spawn('open', ['-a', 'docker']);
    window.docker = dockerSpawn;
  };

  /**
    @param {} -
    stops the docker application
  */
  stopDockerApplication = () => {
    if (window.dockerSpawn && !window.dockerSpawn.killed) {
      childProcess.exec(
        'osascript -e \'quit app "docker"\'',
        {},
        (response, error) => {
          console.log(response, error);
        }
      );

      delete window.docker;
    }
  };

  /**
    @param {} -
    stops the docker application
  */
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
}

export default Docker;
