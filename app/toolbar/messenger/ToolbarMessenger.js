import { ipcRenderer } from 'electron';

class ToolbarMesseneger {
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
    sends open.preferences to ipcRenderer
    MainMessenger recieves message and opens preferences window
  */
  showPreferences = () => {
    ipcRenderer.send('asynchronous-message', 'open.preferences');
  };

  /**
    @param {} -
    sends quit.app to ipcRenderer
    MainMessenger recieves message and hides installer window
  */
  quitApp = () => {
    ipcRenderer.send('asynchronous-message', 'quit.app');
  };
}

export default ToolbarMesseneger;
