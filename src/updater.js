import {dialog} from 'electron';
import {autoUpdater} from 'electron-updater';

let dockerConn;
let updater;
let uiController;
let newImageSize;
autoUpdater.autoDownload = false;
let checkUpToDate;

autoUpdater.on('error', (error) => {
  if(error) {
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
  }
});

autoUpdater.on('update-available', (info) => {
  if(info){
    let tag = info.releaseNotes.split('\n')[0].split(':')[1].slice(1, -4)
    newImageSize = info.releaseNotes.split('\n')[1].split(':')[1].slice(1, -4)
    uiController.handleAppEvent({
      window: 'updateInfo',
      sendWindow: {message: 'message', content: info}
    });
  }
});

autoUpdater.on('update-not-available', () => {
  if (checkUpToDate) {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'Current version is up-to-date.',
    });
  }
  // updater.enabled = true;
  // updater = null;
});

autoUpdater.on('download-progress', (progress) => {
  const prog = progress;
  prog.newImageSize = newImageSize;
  uiController.updateInstallImageWindow(prog, 'update');
});

autoUpdater.on('update-downloaded', (progress) => {
  const prog = progress;
  prog.newImageSize = newImageSize;
  uiController.updateInstallImageWindow(prog, 'update');
});

// export this to MenuItem click callback
export default (dockerClient, uiManager, showUpToDate) => {
  checkUpToDate = showUpToDate;
  dockerConn = dockerClient;
  uiController = uiManager;
  autoUpdater.checkForUpdates();
};
