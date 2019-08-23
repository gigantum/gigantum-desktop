import { dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

log.transports.console.level = 'warn';
log.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

let messengerController;
let newImageSize;
autoUpdater.autoDownload = false;
let checkUpToDate;

autoUpdater.on('error', error => {
  if (error) {
    dialog.showMessageBox({
      title: 'Error checking for updates',
      message: 'Gigantum failed to check for updates. Please try again later.',
      buttons: ['Close']
    });
  }
});

autoUpdater.on('update-available', info => {
  if (info) {
    newImageSize = Number(
      info.releaseNotes
        .split('\n')[2]
        .split(': ')[1]
        .split(' ')[1]
        .slice(1, -5)
    );
    messengerController.sendChangeLog(info);
    messengerController.sendUpdateResponse(true);
  } else {
    autoUpdater.checkForUpdates();
  }
});

autoUpdater.on('update-not-available', () => {
  if (checkUpToDate) {
    messengerController.sendUpdateResponse(false);
  }
});

autoUpdater.on('download-progress', progress => {
  const prog = progress;
  prog.newImageSize = newImageSize;
  messengerController.sendDownloadProgress(prog);
});

autoUpdater.on('update-downloaded', progress => {
  const prog = progress;
  prog.newImageSize = newImageSize;
  prog.success = true;
  messengerController.sendDownloadProgress(prog);
});

// export this to MenuItem click callback
export default (messenger, showUpToDate) => {
  checkUpToDate = showUpToDate;
  messengerController = messenger;
  autoUpdater.checkForUpdates();
};
