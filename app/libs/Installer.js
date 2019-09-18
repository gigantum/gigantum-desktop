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
//
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

fixPath();

const mb = 1000000;
let cores;
let ram;
let diskSize;

si.cpu(cpu => {
  ({ cores } = cpu);
});

si.mem(mem => {
  ram = mem.total / mb;
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
    console.log('downloading docker...');
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
        (error, stdout, stderr) => {
          if (error) {
            callback({
              success: false,
              finished: false
            });
          } else {
            console.log(stdout, stderr);
            callback({
              success: true,
              finished: true
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
    console.log('showing drag and drop');
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
              setTimeout(isInstalled, 1000);
            } else {
              console.log('done');
              callback({ success: true });
            }
            return null;
          })
          .catch(err => {
            console.log(err);
            ps.dispose();
          });
      };
      isInstalled();
    }
  };

  /**
   * @param {Function} callback
   *
   *
   */
  checkIfDockerIsReady = callback => {
    console.log('checking application is ready ...');
    try {
      const dockerPs = childProcess.spawn('docker', ['ps']);

      dockerPs.stdout.on('data', data => {
        const message = data.toString();
        callback({ success: true, data: { message } });
      });

      dockerPs.stderr.on('data', () => {
        setTimeout(() => {
          this.checkIfDockerIsReady(callback);
        }, 1000);
      });
    } catch (error) {
      console.log(`exception: ${error}`);
      setTimeout(() => {
        this.checkIfDockerIsReady(callback);
      }, 1000);
    }
  };

  /**
   * @param {Function} callback
   *
   *
   *
   */
  updateSettings = callback => {
    console.log('update app settings and restart ...');
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

      settings.autoStart = false;
      settings.analyticsEnabled = false;
      diskSize = diskSize > 100000 ? 100000 : diskSize;
      settings.memoryMiB = selectHigherValue(settings.memoryMiB, ram);
      settings.cpus = selectHigherValue(settings.cpus, cores);
      if (isMac) {
        settings.diskSizeMiB = selectHigherValue(
          settings.diskSizeMiB,
          diskSize
        );
      }

      const newSettings = JSON.stringify(settings);

      fs.writeFileSync(settingsPath, newSettings);

      const startDockerApplicationCallback = response => {
        if (response.success) {
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
      this.docker.stopDockerApplication(dockerStopCallback);
    } else {
      callback({ success: true });
    }
  };
}

export default Installer;
