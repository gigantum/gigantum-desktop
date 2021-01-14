// @flow
// vendor
import childProcess from 'child_process';
import DockerApi from 'docker-remote-api';
import Dockerode from 'dockerode';
import os from 'os';
import fs from 'fs';
import path from 'path';
import pump from 'pump';
import throughJSON from 'through-json';
import through from 'through2';
import log from 'electron-log';
import Shell from 'node-powershell';

// config
import config from './config';

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

const ps = new Shell({
  executionPolicy: 'Bypass',
  noProfile: true
});

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

  hostWorkingDir = path.join(os.homedir(), 'gigantum');

  trackedContainer = null;

  /* defaults END */

  dockerConnectionTest = () => this.dockerode.ping();

  /**
    @param {Function} callback
    @param {Number} reconnectCount
    recursively checks docker state untill it is ready
  */
  checkIsDockerReady = (callback, reconnectCount = 0) => {
    console.log('checking docker is ready');
    const nextInterval = reconnectCount + 1;
    const { dockerode } = this;

    const checkAgain = () => {
      setTimeout(() => {
        this.checkIsDockerReady(callback, nextInterval);
      }, 1000);
    };

    if (reconnectCount < 601) {
      dockerode.ping(
        (error, response) => {
          console.log(error, response);
          // TODO test for errors coming from response
          const responseString =
            typeof response === 'object' && response !== null
              ? response.toString()
              : response;
          if (responseString === 'OK') {
            callback({ success: true, data: response });
          } else if (response === null) {
            checkAgain();
          } else {
            callback({ success: false, data: response });
          }
          return null;
        },
        () => {
          checkAgain();
        }
      );
    } else {
      log.warn('Error when checking docker is ready:');
      log.warn(reconnectCount);
      callback({
        success: false,
        data: {
          error: {
            message:
              'Docker is having trouble starting. Timed out after 10 minutes.'
          }
        }
      });
    }
  };

  /**
    @param {} -
    stops the docker application
  */
  checkDockerState = callback => {
    const statusList = ['stop', 'kill', 'unmount', 'disconnect', 'die'];

    const eventHandler = (data, enc, cb) => {
      if (
        data &&
        statusList.indexOf(data.status) !== -1 &&
        data.from === config.imageName
      ) {
        log.warn('Error in check docker state');
        log.warn(data);
        callback({ success: false });
        return null;
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
            callback({ success: false });
          });
          return null;
        },
        err => console.log(err)
      )
      .catch(error => {
        console.log(error);
      });
  };

  /**
    @param {} -
    starts the docker application
  */
  startDockerApplication = callback => {
    let dockerSpawn;
    if (isWindows) {
      let isNewDocker = true;
      const fsPath = 'C:/Program Files/Docker/Docker/Docker Desktop.exe';
      const dockerDesktopPath =
        'C:\\Program Files\\Docker\\Docker\\Docker Desktop';
      const dockerWindowsPath =
        'C:\\Program Files\\Docker\\Docker\\Docker for Windows';
      if (!fs.existsSync(fsPath)) {
        isNewDocker = false;
      }
      const dockerPath = isNewDocker ? dockerDesktopPath : dockerWindowsPath;
      let psCommand = '';
      if (process.env.NODE_ENV === 'development') {
        psCommand = `Remove-Item env:Path; Start-Process "${dockerPath}"`;
      } else {
        process.env.Path = `C:\\ProgramData\\DockerDesktop\\version-bin;C:\\Program Files\\Docker\\Docker\\Resources\\bin;${process.env.Path}`;
        psCommand = `Start-Process "${dockerPath}"`;
      }

      ps.addCommand(psCommand);
      ps.invoke()
        .then(() => {
          callback({ success: true, data: {} });
          return null;
        })
        .catch(() => {
          callback({
            success: true,
            data: {},
            error: { message: 'Docker failed to start' }
          });
        });
    } else if (isMac) {
      dockerSpawn = childProcess.spawn('open', ['-a', 'docker']);
      dockerSpawn.stdout.on('data', () => {});

      dockerSpawn.stderr.on('data', () => {});

      dockerSpawn.on('exit', code => {
        if (code === 0) {
          callback({ success: true, data: {} });
        } else {
          callback({
            success: false,
            data: {
              error: {
                message: 'Docker is not installed'
              }
            }
          });
        }
      });

      dockerSpawn.on('error', error => {
        // TODO handle this error
        console.log(error);
      });

      dockerSpawn.on('close', code => {
        if (code === 0) {
          callback({
            success: true,
            data: {},
            error: { message: 'Docker failed to start' }
          });
        } else {
          callback({
            success: false,
            data: {
              error: {
                message: 'Docker is not installed'
              }
            }
          });
        }
      });
    } else {
      callback({ success: true, data: {} });
      return null;
    }
  };

  /**
    @param {} -
    stops the docker application
  */
  stopDockerApplication = callback => {
    const script = isWindows
      ? 'taskkill /IM "docker desktop.exe"'
      : 'osascript -e \'quit app "docker"\'';
    childProcess.exec(script, {}, (response, error) => {
      if (error) {
        callback({ success: false, data: { error } });
      } else {
        callback({ success: true, data: {} });
      }
    });
    if (window.dockerSpawn && !window.dockerSpawn.killed) {
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
          console.log(err);
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
