// @flow
import childProcess from 'child_process';
import fixPath from 'fix-path';
// libs
import Docker from './Docker';
import Installer from './Installer';
import Gigantum from './Gigantum';

fixPath();

const pingDocker = (dockerConnectionTest, callback) => {
  console.log('rar2');
  dockerConnectionTest()
    .then(
      response => {
        console.log('1', response);
        callback({ isRunning: true });
        return null;
      },
      response => {
        console.log('2', response);

        callback({ isRunning: false });
      }
    )
    .catch(error => {
      console.log('ran in catch');
      callback({ isRunning: false });
      console.log(error);
    });
};

// const isMac = process.platform === 'darwin';

class ToolbarInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  installer = new Installer();

  gigantum = new Gigantum();

  /**
   * Defaults END
   */

  /**
   * @param {Function} dockerExistsCallback
   * @param {Function} gigantumRunningCallback
   * checks if docker is installed
   */
  check = (dockerExistsCallback, gigantumRunningCallback) => {
    const { gigantum } = this;
    const checkGigantumCallback = response => {
      if (response.success) {
        gigantumRunningCallback(response);
      } else {
        dockerExistsCallback({ success: true });
      }
    };
    const dockerVersion = childProcess.spawn('docker', ['-v'], {
      env: {
        PATH: process.env.PATH
      }
    });
    dockerVersion.on('error', error => {
      console.log(error);
    });

    dockerVersion.on('close', code => {
      if (code === 0) {
        gigantum.checkGigantumRunning(checkGigantumCallback);
      } else {
        dockerExistsCallback({
          success: false,
          data: {
            error: {
              message: 'Docker is not installed'
            }
          }
        });
      }
    });
  };

  /**
   * @param {Function} callback
   * checks when docker has been installed
   */
  checkForDockerInstall = callback => {
    const { installer } = this;
    installer.checkForApplication(callback);
  };

  /**
   * @param {Function} callback
   * checks when docker has been installed
   */
  checkForGigantumInstall = callback => {
    const { gigantum } = this;
    gigantum.checkGigantumImage(callback, true);
  };

  /**
   * @param {Function} callback
   * restarts gigantum container
   */
  restart = callback => {
    const { restart } = this.gigantum;

    const restartGigantumCallback = response => {
      callback(response);
    };

    restart(restartGigantumCallback);
  };

  /**
   * @param {Function} callback
   * starts gigntum and docker
   * Starting Steps
   * 1. check if docker is running {isRunning => 4, not running => 2}
   * 2. start docker if it is not running
   * 3. check if docker is ready
   * 4. start gigantum
   */
  start = callback => {
    const { docker, gigantum } = this;
    const data = {};
    const {
      dockerConnectionTest,
      startDockerApplication,
      checkIsDockerReady
    } = docker;

    /**
     * @param {Object} response
     * checks if docker is installed
     */
    const gigantumStartCallback = response => {
      callback(response);
    };

    /**
     * @param {Object} response
     * callb
     * @calls {gigantum.start}
     */
    const checkIsDockerReadyCallback = response => {
      if (response.success) {
        gigantum.start(gigantumStartCallback);
      } else {
        // TODO handle error state
        console.log(response);
      }
    };

    /**
     * @param {Object} response
     * callback for startDockerApplication
     * @calls {checkIsDockerReady}
     */
    const startDockerApplicationCallback = response => {
      if (response.success) {
        /* STEP 3 */
        checkIsDockerReady(checkIsDockerReadyCallback);
      } else {
        // TODO handle error message
        console.log(response);
      }
    };

    /**
     * @param {Object} callback
     * callback for pingDocker
     * @calls {checkIsDockerReadyCallback}
     * @calls {startDockerApplication}
     */
    const dockerRunningCallback = response => {
      if (response.isRunning) {
        console.log('step31');

        checkIsDockerReadyCallback({ success: true, data });
      } else {
        /* STEP 2 */
        console.log('step1');
        startDockerApplication(startDockerApplicationCallback);
      }
    };

    /* STEP 1 */
    console.log('step0');

    pingDocker(dockerConnectionTest, dockerRunningCallback);
  };

  /**
   * @param {Boolean} closeDocker
   * @param {Function} callback
   * stops gigantum container
   * stops docker if closeDocker is true
   */
  stop = (callback, closeDocker) => {
    const { stop } = this.gigantum;
    const { stopDockerApplication } = this.docker;

    const closeGigantumCallback = response => {
      if (closeDocker) {
        stopDockerApplication(() => {});
      }
      callback(response);
    };

    stop(closeGigantumCallback);
  };

  /**
   * @param {Function} callback
   * restarts docker and then starts the container
   */
  restartDocker = callback => {
    const { docker } = this;

    const stopDockerCallback = response => {
      if (response.success) {
        this.start(callback);
      } else {
        callback({ success: false });
      }
    };

    docker.stopDockerApplication(stopDockerCallback);
  };

  /**
   * @param {Function} callback
   * checks to see if any gigantum projects are running
   */
  checkRunningProjects = callback => {
    const { gigantum } = this;

    gigantum.stopProjects(callback, true);
  };

  /**
   * @param {Function} callback
   * removes gigantum image
   */
  removePreviousImage = callback => {
    const { gigantum } = this;

    gigantum.removeGigantumImage(callback);
  };

  /**
   * @param {Function} callback
   * checks to see if docker events throws bad status
   */
  listenToDockerEvents = callback => {
    const { docker } = this;

    docker.checkDockerState(callback);
  };
}

export default ToolbarInterface;
