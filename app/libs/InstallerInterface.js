// @flow
import childProcess from 'child_process';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';
import Installer from './Installer';

const isMac = process.platform === 'darwin';
// TODO Windows logic
// const isWindows = process.platform === 'win32';

class InstallerInterface {
  /**
   * Declare defaults here
   */
  docker = new Docker();

  gigantum = new Gigantum();

  installer = new Installer();

  /**
   * Defaults END
   */

  /**
   * @param {Function} callback
   * checks if docker is installed
   */
  check = callback => {
    if (isMac) {
      const dockerVersion = childProcess.spawn('docker', ['-v']);
      dockerVersion.on('error', error => {
        console.log(error);
      });

      dockerVersion.on('close', code => {
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
    } else {
      callback({
        success: false,
        data: {
          error: {
            message: "Can't find docker appliation"
          }
        }
      });
    }
  };

  /**
   * @param {Function} callback
   * handles docker download
   * @calls {installer.downloadDocker}
   */
  download = callback => {
    const { installer } = this;

    installer.downloadDocker(callback);
  };

  /**
   * @param {Function} callback
   * @param {Object} downloadedFile
   * handles drag and drop
   * @calls {installer.openDragAndDrop}
   */
  handleDnD = (downloadedFile, callback) => {
    const { installer } = this;
    /**
     * @param {Object} response
     * handles response from dragAndDrop
     * @calls {installer.checkForApplication}
     */
    const checkForApplicationCallback = response => {
      if (response.success) {
        callback(response);
      } else {
        callback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from dragAndDrop
     * @calls {installer.checkForApplication}
     */
    const dragAndDropCallback = response => {
      if (response.success) {
        installer.checkForApplication(checkForApplicationCallback);
      } else {
        callback({ success: false, data: {} });
      }
    };

    installer.openDragAndDrop(downloadedFile, dragAndDropCallback);
  };

  /**
   * @param {Function} callback
   * @param {Object} downloadedFile
   * handles configure docker
   * @calls {docker.startDockerApplication}
   */
  configureDocker = (callback, skipConfigure) => {
    const { installer, docker } = this;
    /**
     * @param {Object} response
     * handles response from updateSettings
     * @calls {callback}
     */
    const updateSettingsCallback = response => {
      if (response.success) {
        callback(response);
      } else {
        callback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from checkIfDockerIsReady
     * @calls {installer.checkForApplication}
     */
    const dockerisReadyCallback = response => {
      if (response.success) {
        if (skipConfigure) {
          callback(response);
        } else {
          installer.updateSettings(updateSettingsCallback);
        }
      } else {
        callback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from startDockerApplication
     * @calls {installer.checkIfDockerIsReady}
     */
    const startDockerCallback = response => {
      if (response.success) {
        installer.checkIfDockerIsReady(dockerisReadyCallback);
      } else {
        callback({ success: false, data: {} });
      }
    };
    docker.startDockerApplication(startDockerCallback);
  };

  /**
   * @param {Function} callback
   * handles docker download
   * @calls {gigantum.downloadDocker}
   */
  configureGigantum = callback => {
    const { gigantum } = this;

    gigantum.configureGigantum(callback);
  };
}

export default InstallerInterface;
