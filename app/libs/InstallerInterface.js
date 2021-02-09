// @flow
import disk from 'check-disk-space';
import log from 'electron-log';
import os from 'os';
// libs
import Docker from './Docker';
import Gigantum from './Gigantum';
import Installer from './Installer';
import spawnWrapper from './spawnWrapper';
import Storage from '../storage/Storage';
import wslStatus from './wslStatus';

const isWindows = process.platform === 'win32';

class ShellMoc {
  constructor(state) {
    this.state = state;
  }
}

const Shell = isWindows ? require('node-powershell') : ShellMoc;

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
    dockerVersion.on('error', () => {});
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
   * checks if linux kernal is installed
   */
  checkKernalInstall = callback => {
    const isInstalled = () => {
      const ps = new Shell({
        executionPolicy: 'Bypass',
        noProfile: true
      });
      ps.addCommand(
        '(gp HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*).DisplayName -Contains "Windows Subsystem for Linux Update"'
      );
      ps.invoke()
        .then(response => {
          const formattedResponse = response.replace(/^\s+|\s+$/g, '');
          if (formattedResponse !== 'True') {
            ps.dispose();
            callback({ success: false });
          } else {
            callback({ success: true });
          }
          return null;
        })
        .catch(() => {
          ps.dispose();
        });
    };
    isInstalled();
  };

  /**
   * @param {Function} callback
   * checks if docker is installed
   */
  check = callback => {
    const storage = new Storage();
    const wslConfigured = storage.get('wslConfigured');
    let wsl2Supported = false;
    if (isWindows) {
      const build = os.release().split('.')[2];
      wsl2Supported = Number(build) >= 19041;
    }
    if (isWindows && !wslConfigured && wsl2Supported) {
      // callback if WSL returns error, when WSL command doesn't exist
      const noWSLCallback = () => {
        callback({
          success: false,
          data: {
            error: {
              message: 'WSL2 not configured.'
            }
          }
        });
      };
      // when wsl is available, checks kernal install
      const wslAvailableCallback = () => {
        this.checkKernalInstall(res => {
          if (res.success) {
            this.checkDocker(callback);
          } else {
            callback({
              success: false,
              data: {
                error: {
                  message: 'WSL2 not configured.'
                }
              }
            });
          }
        });
      };
      this.checkKernalInstall(res => console.log(res));
      wslStatus(wslAvailableCallback, wslAvailableCallback, noWSLCallback);
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
   * @param {Function} callback
   * handles enabling WSL
   * @calls {installer.enableWindowsSubystem}
   */
  enableSubsystem = callback => {
    const { installer } = this;

    installer.enableWindowsSubystem(callback);
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
      if (response.success) {
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
    this.configureDocker({ defaultCallback: configureDockerCallback }, true);
  };

  /**
   * @param {Function} callback
   * handles linux terminal launch
   * @calls {installer.installKernal}
   */
  installKernal = callback => {
    const { installer } = this;

    installer.installKernal(callback);
  };
}

export default InstallerInterface;
