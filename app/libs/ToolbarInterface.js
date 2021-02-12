// libs
import Docker from './Docker';
import Installer from './Installer';
import Gigantum from './Gigantum';
import spawnWrapper from './spawnWrapper';

const pingDocker = (dockerConnectionTest, callback) => {
  dockerConnectionTest()
    .then(
      () => {
        callback({ isRunning: true });
        return null;
      },
      () => {
        callback({ isRunning: false });
      }
    )
    .catch(() => {
      callback({ isRunning: false });
    });
};

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
      if (response.success && gigantumRunningCallback) {
        gigantumRunningCallback(response);
      } else {
        dockerExistsCallback({ success: true });
      }
    };
    const dockerVersion = spawnWrapper.getSpawn('docker', ['-v']);
    dockerVersion.on('error', error => {
      console.log(error);
    });

    dockerVersion.on('close', code => {
      if (code === 0) {
        gigantum.checkGigantumRunning(checkGigantumCallback);
      } else {
        dockerExistsCallback({
          success: false,
          data: {},
          error: {
            message: 'Docker is not installed'
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
    installer.checkDockerInstall(callback);
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
        checkIsDockerReadyCallback({ success: true, data });
      } else {
        /* STEP 2 */
        startDockerApplication(startDockerApplicationCallback);
      }
    };

    const dockerExistsCallback = response => {
      if (response.success) {
        pingDocker(dockerConnectionTest, dockerRunningCallback);
      } else {
        callback(response);
      }
    };

    /* STEP 1 */
    this.check(dockerExistsCallback);
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
