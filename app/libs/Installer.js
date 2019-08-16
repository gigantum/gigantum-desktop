// @flow
// vendor
import childProcess from 'child_process';
import download from 'download';
import open from 'open';
import fs from 'fs';
import os from 'os';
// libs
import Docker from './Docker';
//
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

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

    if (isMac) {
      downloadLink = 'https://download.docker.com/mac/stable/Docker.dmg';
      downloadDirectory = `${os.homedir()}/Downloads`;
      downloadedFile = `${downloadDirectory}/docker.dmg`;
    } else if (isWindows) {
      downloadLink =
        'https://download.docker.com/win/stable/ Docker%20for%20Windows%20Installer.exe';
      downloadDirectory = `${os.homedir()}/Downloads`;
      downloadedFile = `${downloadDirectory}/ Docker%20for%20Windows%20Installer.exe`;
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
      open(downloadedFile, ['-a', 'finder']);
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
    }
  };

  /**
   * @param {Function} callback
   * @param {Number} count
   *
   *
   */
  checkForApplication = callback => {
    console.log('checking For Application...');
    if (isMac) {
      const dockerVersion = childProcess.spawn('docker', ['-v']);
      dockerVersion.on('error', error => {
        console.log(error);
      });

      dockerVersion.on('close', code => {
        console.log(`${code}`);

        if (code === 0) {
          this.checkDockerInstall(callback);
        } else {
          setTimeout(() => {
            this.checkForApplication(callback);
          }, 1000);
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
   *
   *
   */
  checkIfDockerIsReady = callback => {
    console.log('checking application is ready ...');
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
  };

  /**
   * @param {Function} callback
   *
   *
   *
   */
  updateSettings = callback => {
    console.log('update app settings and restart ...');
    const settingsPath = `${os.homedir()}/Library/Group Containers/group.com.docker/settings.json`;

    if (fs.existsSync(settingsPath)) {
      const settingsRawData = fs.readFileSync(settingsPath);
      const settings = JSON.parse(settingsRawData);

      const selectHigherValue = (current, lowerBound) =>
        current >= lowerBound ? current : lowerBound;

      settings.autoStart = false;
      settings.analyticsEnabled = false;
      settings.memoryMiB = selectHigherValue(settings.memoryMiB, 10240);
      settings.cpus = selectHigherValue(settings.cpus, 2);
      settings.diskSizeMiB = selectHigherValue(settings.diskSizeMiB, 102400);

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
