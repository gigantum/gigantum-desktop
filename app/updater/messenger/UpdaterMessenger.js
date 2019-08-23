import { ipcRenderer } from 'electron';

class UpdaterMessenger {
  /**
    @param {} -
    sends hide.updater to ipcRenderer
    MainMessenger recieves message and hides updater window
  */
  closeUpdater = () => {
    ipcRenderer.send('asynchronous-message', 'close.updater');
  };

  /**
    @param {} -
    sends download.update to ipcRenderer
    MainMessenger recieves message and begins download
  */
  downloadUpdate = () => {
    ipcRenderer.send('asynchronous-message', 'download.update');
  };

  /**
    @param {Function} - callback
    sends update.response to ipcRenderer
    ToolbarMessenger recieves message and updates UI
  */
  checkDownloadProgress = callback => {
    ipcRenderer.on('asynchronous-message', (evt, message) => callback(message));
  };
}

export default UpdaterMessenger;
