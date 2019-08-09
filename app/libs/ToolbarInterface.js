// @flow
import childProcess from 'child_process';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';

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
    .catch(error => {
      console.log(error);
    });
};

class ToolbarInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  gigantum = new Gigantum();

  /**
   * Defaults END
   */

  /**
   * @param {Function} callback
   * checks if docker is installed
   */
  check = callback => {
    const dockerPS = childProcess.spawn('docker', ['ps']);

    dockerPS.on('exit', code => {
      const data = {};
      const success = code === 1;
      callback({ success, data });
    });
  };

  /**
   * @param {Function} callback
   * restarts gigantum container
   */
  restart = callback => {
    const success = true;
    const data = {};

    callback({ success, data });
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
    const success = true;
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
        checkIsDockerReadyCallback({ success: true, data });
      } else {
        /* STEP 2 */
        startDockerApplication(startDockerApplicationCallback);
      }
    };

    /* STEP 1 */
    pingDocker(dockerConnectionTest, dockerRunningCallback);

    // check if docker is running
    callback({ success, data });
  };

  /**
   * @param {Boolean} closeDocker
   * @param {Function} callback
   * stops gigantum container
   * stops docker if closeDocker is true
   */
  stop = (callback, closeDocker) => {
    const success = true;
    const data = {};
    console.log(closeDocker);
    callback({ success, data });
  };
}

export default ToolbarInterface;
