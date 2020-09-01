// @flow
import disk from 'check-disk-space';
import childProcess from 'child_process';
import log from 'electron-log';
import os from 'os';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';
import Installer from './Installer';
import spawnWrapper from './spawnWrapper';

const isWindows = process.platform === 'win32';

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

  checkDocker = callback => {
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
   * @param {Function} callback
   * checks if docker is installed
   */
  check = callback => {
    console.log(isWindows);
    if (isWindows) {
      const build = os.release().split('.')[2];
      const wsl2Supported = Number(build) >= 19041;
      console.log('ran here');
      if (wsl2Supported) {
        console.log('wsl2 supported');
        const wslCheck = childProcess.spawn('powershell', ['wsl', '-l', '-v']);
        wslCheck.stdout.on('data', data => {
          const repositoryUninstalled =
            data
              .toString()
              .split('\n')[0]
              .replace(/[^a-zA-Z ]/g, '') ===
            'Windows Subsystem for Linux has no installed distributions';

          if (repositoryUninstalled) {
            console.log('wsl2 callback called');
            callback({
              success: false,
              data: {
                error: {
                  message: 'WSL2 not configured.'
                }
              }
            });
          } else {
            this.checkDocker(callback);
          }
        });
      }
    } else {
      this.checkDocker(callback);
    }
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
        this.handleDnD(
          response.data.downloadedFile,
          launchCallback,
          dndCallback
        );
      } else if (response.success) {
        progressCallback({ success: true, progress: response.data.progress });
      } else {
        log.warn('Error in download');
        log.warn(response);
        progressCallback({ success: false });
      }
    };

    installer.downloadDocker(downloadDockerCallback);
  };

  /**
   * @param {Function} progressCallback
   * @param {Function} dndCallback
   * handles docker download
   * @calls {installer.downloadDocker}
   */
  downloadLinux = (progressCallback, launchCallback, configureCallback) => {
    const { installer } = this;

    const downloadLinuxCallback = response => {
      if (response.success && response.finished) {
        progressCallback({ success: true, progress: 100, finished: true });
        installer.enableWindowsSubystem(
          launchCallback,
          response.data.downloadedFile,
          configureCallback
        );
      } else if (response.success) {
        progressCallback({ success: true, progress: response.data.progress });
      } else {
        log.warn('Error in download');
        log.warn(response);
        progressCallback({ success: false });
      }
    };

    // installer.downloadDocker(downloadDockerCallback);
    installer.downloadLinux(downloadLinuxCallback);
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
        log.warn('Error in check docker install');
        log.warn(response);
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
        log.warn('Error in dnd callback');
        log.warn(response);
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
      console.log(response);
      if (response.success) {
        defaultCallback(response);
      } else {
        log.warn('Error in update settings cb');
        log.warn(response);
        defaultCallback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from checkIfDockerIsReady
     * @calls {installer.startDockerApplication}
     */
    const dockerisReadyCallback = response => {
      console.log(response);
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
        log.warn('Error in docker is ready cb');
        log.warn(response);
        defaultCallback({ success: false, data: {} });
      }
    };
    /**
     * @param {Object} response
     * handles response from startDockerApplication
     * @calls {installer.checkIfDockerIsReady}
     */
    const startDockerCallback = response => {
      console.log(response);
      if (response.success) {
        console.log('ran in start docker callback');
        installer.checkIfDockerIsReady(dockerisReadyCallback);
      } else {
        log.warn('Error in start docker cb');
        log.warn(response);
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
    console.log('made it here');
    this.configureDocker({ defaultCallback: configureDockerCallback }, true);
  };
}

export default InstallerInterface;
