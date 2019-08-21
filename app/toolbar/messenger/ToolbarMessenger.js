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
  hideInstaller = () => {
    ipcRenderer.send('asynchronous-message', 'hide.installer');
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
