// libs
import Docker from './Docker';
import Gigantum from './Gigantum';

const isWindows = process.platform === 'win32';

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

class UpdaterInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  gigantum = new Gigantum();

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
   * @param {Object} updateResponse
   * handles update gigantum
   * @calls {}
   */
  updateGigantumImage = (callback, updateResponse) => {
    const { gigantum, docker } = this;
    const { newImageTag, newImageSize } = updateResponse;
    let updaterStartedDocker;
    const {
      dockerConnectionTest,
      startDockerApplication,
      checkIsDockerReady,
      stopDockerApplication
    } = docker;
    const imageName = `gigantum/labmanager:${newImageTag}`;

    const pullImageCallback = response => {
      if (updaterStartedDocker && response.data.finished && !isWindows) {
        stopDockerApplication(() => callback(response));
      } else {
        callback(response);
      }
    };

    const checkIsDockerReadyCallback = response => {
      const imageData = {
        name: imageName,
        tag: newImageTag,
        size: newImageSize
      };
      if (response.success) {
        gigantum.pullImage(pullImageCallback, imageData);
      }
    };

    const startDockerApplicationCallback = response => {
      if (response.success) {
        checkIsDockerReady(checkIsDockerReadyCallback);
      }
    };

    const dockerRunningCallback = response => {
      if (response.isRunning) {
        updaterStartedDocker = false;
        checkIsDockerReadyCallback({ success: true });
      } else {
        updaterStartedDocker = true;
        startDockerApplication(startDockerApplicationCallback);
      }
    };

    pingDocker(dockerConnectionTest, dockerRunningCallback);
  };
}

export default UpdaterInterface;
