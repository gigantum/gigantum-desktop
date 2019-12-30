// @flow
// vendor
import childProcess from 'child_process';
import download from 'download';
import open from 'open';
import fs from 'fs';
import os from 'os';
import fixPath from 'fix-path';
import Shell from 'node-powershell';
import sudo from 'sudo-prompt';
import si from 'systeminformation';
// libs
import Docker from './Docker';
import spawnWrapper from './spawnWrapper';
//
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

fixPath();

const mb = 1048576;
let cores;
let ram;
let diskSize;

si.cpu(cpu => {
  ({ cores } = cpu);
});

si.mem(mem => {
  ram = mem.available / mb;
});

si.diskLayout(disk => {
  diskSize = disk[0].size / mb;
});

class Installer {
  docker = new Docker();
  /**
   * Declare defaults here
   */

  /**
   * Defaults END
   */

  /**
   * @param {Function} callback
   *
   *
   */
  downloadDocker = callback => {
    let downloadLink = '';
    let downloadDirectory = '';
    let downloadedFile = '';
    if (isLinux) {
      callback({
        success: true,
        finished: false,
        data: {
          progress: null
        }
      });
      const options = { name: 'Gigantum', shell: true };
      sudo.exec(
        `groupadd docker && curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && usermod -aG docker ${process.env.USER}`,
        options,
        error => {
          if (error) {
            callback({
              success: false,
              finished: false,
              data: {}
            });
          } else {
            callback({
              success: true,
              finished: true,
              data: {}
            });
          }
        }
      );
    } else {
      if (isMac) {
        downloadLink = 'https://download.docker.com/mac/stable/Docker.dmg';
        downloadDirectory = `${os.homedir()}/Downloads`;
        downloadedFile = `${downloadDirectory}/docker.dmg`;
      } else if (isWindows) {
        downloadLink =
          'https://download.docker.com/win/stable/Docker for Windows Installer.exe';
        downloadDirectory = `${os.homedir()}\\Downloads`;
        downloadedFile = `${downloadDirectory}\\Docker%20for%20Windows%20Installer.exe`;
      }

      let downloadProgress = 0;

      download(downloadLink, downloadDirectory, { extract: true, strip: 1 })
        .on('response', response => {
          const totalSize = response.headers['content-length'];
          let count = 0;
          response.on('data', data => {
            count += 1;
            downloadProgress += data.length;
            // delay frequency of callback firing - causes UI to crash
            if (count % 50 === 0) {
              callback({
                success: true,
                finished: false,
                data: {
                  progress: (downloadProgress / totalSize) * 100
                }
              });
            }
          });
        })
        .then(() => {
          callback({
            success: true,
            finished: true,
            data: { downloadedFile }
          });

          return null;
        })
        .catch(error => {
          callback({
            success: false,
            finished: false,
            data: { downloadedFile }
          });
          console.log(error);
        });
    }
  };

  /**
   * @param {String} downloadedFile
   * @param {Function} callback
   *
   *
   */
  openDragAndDrop = (downloadedFile, callback) => {
    if (isMac) {
      open(downloadedFile, ['-a', 'finder']);
    } else if (isWindows) {
      open(downloadedFile);
    }
    callback({ success: true, data: {} });
  };

  /**
    @param {Function} - callback
    checks to see if docker is installed
  */
  checkDockerInstall = callback => {
    if (isMac) {
      let repeatCount = 0;
      let lastSize = 0;
      const checkDocker = () => {
        const dockerSize = childProcess.spawn('du', [
          '-sh',
          '-k',
          '/Applications/Docker.app'
        ]);
        dockerSize.stdout.on('data', data => {
          const size = data.toString();
          if (size === lastSize) {
            repeatCount += 1;
          } else {
            repeatCount = 0;
          }
          lastSize = size;
        });
        if (repeatCount <= 5) {
          setTimeout(checkDocker, 500);
        } else {
          childProcess.spawn('diskutil', ['eject', 'Docker']);
          callback({ success: true });
        }
      };
      checkDocker();
    } else if (isWindows) {
      const isInstalled = () => {
        const ps = new Shell({
          executionPolicy: 'Bypass',
          noProfile: true
        });
        ps.addCommand(
          '(gp HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*).DisplayName -Contains "Docker Desktop"'
        );
        ps.invoke()
          .then(response => {
            const formattedResponse = response.replace(/^\s+|\s+$/g, '');
            if (formattedResponse !== 'True') {
              ps.dispose();
              setTimeout(isInstalled, 1000);
            } else {
              callback({ success: true });
            }
            return null;
          })
          .catch(() => {
            setTimeout(isInstalled, 1000);
            ps.dispose();
          });
      };
      isInstalled();
    }
  };

  /**
   * @param {Function} callback
     @param {Number} reconnectCount
   * recursively checks docker ps untill it is ready
   *
   */
  checkIfDockerIsReady = (callback, reconnectCount = 0, checkNotReady) => {
    if (reconnectCount < 601 || checkNotReady) {
      if (isWindows && process.env.PATH.indexOf('Docker') === -1) {
        process.env.PATH = `C:\\ProgramData\\DockerDesktop\\version-bin;C:\\Program Files\\Docker\\Docker\\Resources\\bin;${process.env.PATH}`;
      }
      try {
        const dockerPs = spawnWrapper.getSpawn('docker', ['ps']);
        dockerPs.stdout.on('data', data => {
          const message = data.toString();
          if (!checkNotReady) {
            callback({ success: true, data: { message } });
          } else if (!this.timeout) {
            this.timeout = setTimeout(() => {
              this.timeout = null;
              this.checkIfDockerIsReady(
                callback,
                reconnectCount + 1,
                checkNotReady
              );
            }, 1000);
          }
        });

        dockerPs.stderr.on('data', () => {
          if (checkNotReady) {
            callback({ success: true });
          } else {
            setTimeout(() => {
              this.checkIfDockerIsReady(
                callback,
                reconnectCount + 1,
                checkNotReady
              );
            }, 1000);
          }
        });
        dockerPs.on('error', () => {
          if (checkNotReady) {
            callback({ success: true });
          } else {
            setTimeout(() => {
              this.checkIfDockerIsReady(
                callback,
                reconnectCount + 1,
                checkNotReady
              );
            }, 1000);
          }
        });
      } catch (error) {
        if (checkNotReady) {
          callback({ success: true });
        } else {
          setTimeout(() => {
            this.checkIfDockerIsReady(
              callback,
              reconnectCount + 1,
              checkNotReady
            );
          }, 1000);
        }
      }
    } else {
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
   * @param {Function} callback
   * @param {Function} windowsDockerStartedCallback
   * @param {Function} windowsDockerRestartingCallback
   *
   *
   *
   */
  updateSettings = (
    callback,
    windowsDockerStartedCallback,
    windowsDockerRestartingCallback
  ) => {
    let settingsPath;

    if (isMac) {
      settingsPath = `${os.homedir()}/Library/Group Containers/group.com.docker/settings.json`;
    } else if (isWindows) {
      settingsPath = `${os.homedir()}\\AppData\\Roaming\\Docker\\settings.json`;
    }

    if (fs.existsSync(settingsPath)) {
      const settingsRawData = fs.readFileSync(settingsPath);
      const settings = JSON.parse(settingsRawData);

      const selectHigherValue = (current, lowerBound) =>
        current >= lowerBound ? current : Math.floor(lowerBound / 2);

      const alignMemory = memory => memory - (memory % 8);

      settings.autoStart = false;
      settings.displayedWelcomeWhale = false;
      settings.analyticsEnabled = false;
      diskSize = diskSize > 100000 ? 100000 : diskSize;
      settings.memoryMiB = alignMemory(
        selectHigherValue(settings.memoryMiB, ram)
      );
      settings.cpus = selectHigherValue(settings.cpus, cores);
      if (isMac) {
        settings.diskSizeMiB = selectHigherValue(
          settings.diskSizeMiB,
          diskSize
        );
      }
      if (isWindows) {
        settings.sharedDrives = {
          C: true
        };
      }

      const newSettings = JSON.stringify(settings);

      fs.writeFileSync(settingsPath, newSettings);

      const startDockerApplicationCallback = response => {
        if (response.success) {
          if (isWindows && windowsDockerRestartingCallback) {
            windowsDockerRestartingCallback();
          }
          this.checkIfDockerIsReady(callback);
        } else {
          callback({ success: false });
        }
      };

      const dockerStopCallback = response => {
        if (response.success) {
          this.docker.startDockerApplication(startDockerApplicationCallback);
        } else {
          callback({ success: false });
        }
      };

      if (isWindows) {
        windowsDockerStartedCallback();
        this.checkIfDockerIsReady(startDockerApplicationCallback, 0, true);
      } else {
        this.docker.stopDockerApplication(dockerStopCallback);
      }
    } else {
      callback({ success: true });
    }
  };
}

export default Installer;