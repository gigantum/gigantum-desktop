import {dialog} from 'electron';
import {autoUpdater} from 'electron-updater';

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
  setTimeout(() =>{
    if(info){
      let tag = info.releaseNotes.split('\n')[2].split(': ')[1].split(' ')[0]
      newImageSize = info.releaseNotes.split('\n')[2].split(': ')[1].split(' ')[1].slice(1, -5)
      uiController.handleAppEvent({
        window: 'updateInfo',
        sendWindow: {message: 'message', content: info}
      });
    } else {
      autoUpdater.checkForUpdates();
    }
  }, 0)
});

autoUpdater.on('update-not-available', () => {
  if (checkUpToDate) {
    let index = dialog.showMessageBox({
      title: 'No Updates',
      message: 'Gigantum is already up to date.',
      buttons: ['Close']
    });
  }
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
export default (uiManager, showUpToDate) => {
  checkUpToDate = showUpToDate;
  uiController = uiManager;
  autoUpdater.checkForUpdates();
};
