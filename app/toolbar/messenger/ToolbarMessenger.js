import { ipcRenderer, remote } from 'electron';

class ToolbarMesseneger {
  /**
    @param {} -
    sends open.installer to ipcRenderer
    MainMessenger recieves message and opens toolbar window
  */
  showToolbar = () => {
    ipcRenderer.send('asynchronous-message', 'open.toolbar');
  };

  /**
    @param {} -
    sends open.installer to ipcRenderer
    MainMessenger recieves message and opens installer window
  */
  showInstaller = () => {
    ipcRenderer.send('asynchronous-message', 'open.installer');
  };

  /**
    @param {} -
    sends hide.installer to ipcRenderer
    MainMessenger recieves message and hides installer window
  */
  closeInstaller = () => {
    ipcRenderer.send('asynchronous-message', 'close.installer');
  };

  /**
    @param {} -
    sends open.about to ipcRenderer
    MainMessenger recieves message and opens about window
  */
  showAbout = () => {
    ipcRenderer.send('asynchronous-message', 'open.about');
  };

  /**
    @param {} -
    sends open.addServer to ipcRenderer
    MainMessenger recieves message and opens addServer window
  */
  showManageServer = () => {
    ipcRenderer.send('asynchronous-message', 'open.manageServer');
  };

  /**
    @param {} -
    sends open.addServer to ipcRenderer
    MainMessenger recieves message and opens addServer window
  */
  closeManageServer = () => {
    ipcRenderer.send('asynchronous-message', 'close.manageServer');
  };

  /**
    @param {} -
    sends open.preferences to ipcRenderer
    MainMessenger recieves message and opens preferences window
  */
  showPreferences = () => {
    ipcRenderer.send('asynchronous-message', 'open.preferences');
  };

  /**
    @param {} -
    sends check.updates to ipcRenderer
    MainMessenger recieves message and checks for updates
  */
  checkUpdates = () => {
    ipcRenderer.send('asynchronous-message', 'check.updates');
  };

  /**
    @param {Function} - callback
    sends update.response to ipcRenderer
    ToolbarMessenger recieves message and updates UI
  */
  checkUpdatesResponse = callback => {
    ipcRenderer.on('asynchronous-message', (evt, message) => callback(message));
  };

  /**
    @param {Function} - callback
    sends update.response to ipcRenderer
    ToolbarMessenger recieves message and updates UI
  */
  checkLaunch = callback => {
    ipcRenderer.on('start-gigantum', () => callback());
  };

  /**
    @param {Function} - callback
    sends quit.app to ipcRenderer
    ToolbarMessenger recieves message and updates UI
  */
  checkQuitApp = callback => {
    ipcRenderer.on('quit.app', () => callback());
  };

  /**
    @param {Object} - toolbarInterface
    sends quit.app to ipcRenderer
    MainMessenger recieves message and hides installer window
  */
  quitApp = toolbarInterface => {
    const { downloadComplete } = remote.getCurrentWindow();
    const callback = () => ipcRenderer.send('asynchronous-message', 'quit.app');
    if (downloadComplete) {
      toolbarInterface.removePreviousImage(callback);
    } else {
      callback();
    }
  };
}

export default ToolbarMesseneger;
