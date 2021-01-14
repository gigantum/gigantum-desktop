import { ipcRenderer } from 'electron';

class ToolbarMesseneger {
  /**
    @param {} -
    sends open.settings to ipcRenderer
    MainMessenger recieves message and closes settings window
  */
  closeSettings = () => {
    ipcRenderer.send('asynchronous-message', 'close.settings');
  };

  /**
    @param {} -
    sends autolaunch.off to ipcRenderer
    MainMessenger recieves message and sets autolaunch off
  */
  setAutoLaunchOff = () => {
    ipcRenderer.send('asynchronous-message', 'autolaunch.off');
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
    sends autolaunch.on to ipcRenderer
    MainMessenger recieves message and sets autolaunch on
  */
  setAutoLaunchOn = () => {
    ipcRenderer.send('asynchronous-message', 'autolaunch.on');
  };
}

export default ToolbarMesseneger;
