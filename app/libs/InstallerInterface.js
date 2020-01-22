// @flow
import disk from 'check-disk-space';
import fixPath from 'fix-path';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';
import Installer from './Installer';
import spawnWrapper from './spawnWrapper';

const isWindows = process.platform === 'win32';

fixPath();

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
    const dockerVersion = spawnWrapper.getSpawn('docker', ['-v']);
    dockerVersion.on('error', error => {
      console.log(error);
    });
    dockerVersion.on('close', code => {
      if (code === 0) {
        callback({ success: true, data: {} });
      } else {
        const path = isWindows ? 'c:' : '/';
        disk(path)
          .then(diskSpace => {
            const notEnoughSpace = diskSpace.available / 1000000000 < 8;
            if (notEnoughSpace) {
              callback({
                success: false,
                data: {
                  error: {
                    message: 'Not Enough Disk Space',
                    spaceAvailable: (diskSpace.available / 1000000000).toFixed(
                      1
                    )
                  }
                }
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
            return null;
          })
          .catch(() => {
            callback({
              success: false,
              data: {
                error: {
                  message: 'Could not determine disk space'
                }
              }
            });
          });
      }
    });
  };

  /**
   * @param {Function} progressCallback
   * @param {Function} dndCallback
   * handles docker download
   * @calls {installer.downloadDocker}
   */
  download = (progressCallback, launchCallback, dndCallback) => {
    const { installer } = this;
    const downloadDockerCallback = response => {
      if (response.success && response.finished) {
        progressCallback({ success: true, progress: 100, finished: true });
        this.handleDnD(response.data.downloadedFile, launchCallback, dndCallback);
      } else if (response.success) {
        progressCallback({ success: true, progress: response.data.progress });
      } else {
        progressCallback({ success: false });
      }
    };

    installer.downloadDocker(downloadDockerCallback);
  };

  /**
   * @param {Function} callback
   * @param {Object} downloadedFile
   * handles drag and drop
   * @calls {installer.openDragAndDrop}
   */
  handleDnD = (downloadedFile, launchCallback, callback) => {
    const { installer } = this;
    /**
     * @param {Object} response
     * handles response from dragAndDrop
     * @calls {installer.checkDockerInstall}
     */
    const checkDockerInstallCallback = response => {
      if (response.success) {
        callback(response);
      } else {
        callback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from dragAndDrop
     * @calls {installer.checkDockerInstall}
     */
    const dragAndDropCallback = response => {
      if (response.success) {
        installer.checkDockerInstall(checkDockerInstallCallback);
        launchCallback({ success: true, data: {} });
      } else {
        callback({ success: false, data: {} });
      }
    };

    installer.openDragAndDrop(downloadedFile, dragAndDropCallback);
  };

  /**
   * @param {Object} callbacks
   * @param {Object} downloadedFile
   * handles configure docker
   * @calls {docker.startDockerApplication}
   */
  configureDocker = (callbacks, skipConfigure) => {
    const { installer, docker } = this;
    const {
      defaultCallback,
      windowsDockerStartedCallback,
      windowsDockerRestartingCallback
    } = callbacks;

    /**
     * @param {Object} response
     * handles response from updateSettings
     * @calls {callback}
     */
    const updateSettingsCallback = response => {
      if (response.success) {
        defaultCallback(response);
      } else {
        defaultCallback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from checkIfDockerIsReady
     * @calls {installer.startDockerApplication}
     */
    const dockerisReadyCallback = response => {
      if (response.success) {
        if (skipConfigure) {
          defaultCallback(response);
        } else {
          installer.updateSettings(
            updateSettingsCallback,
            windowsDockerStartedCallback,
            windowsDockerRestartingCallback
          );
        }
      } else {
        defaultCallback({ success: false, data: {} });
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
        defaultCallback({ success: false, data: {} });
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
    const configureDockerCallback = () => {
      gigantum.configureGigantum(callback);
    };
    this.configureDocker({ defaultCallback: configureDockerCallback }, true);
  };
}

export default InstallerInterface;
