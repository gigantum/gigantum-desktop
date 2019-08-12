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

    download(downloadLink, downloadDirectory)
      .then(() => {
        callback({
          success: true,
          data: { downloadedFile }
        });

        return null;
      })
      .catch(error => {
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
          setTimeout(() => {
            this.docker.startDockerApplication(callback);
          }, 30000); // TODO remove timeout, figure out how to detect when app is ready

          // callback({sucess: true })
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

      settings.autoStart = false;
      settings.analyticsEnabled = false;
      settings.memoryMiB = 10240;
      settings.cpus = 2;
      settings.diskSizeMiB = 102400;

      const newSettings = JSON.stringify(settings);

      fs.writeFileSync(settingsPath, newSettings);

      const dockerStopCallback = response => {
        console.log(response);
        if (response.success) {
          this.docker.startDockerApplication(callback);
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
