import { ipcRenderer } from 'electron';

class InstallerMessenger {
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
    sends autolaunch.on to ipcRenderer
    MainMessenger recieves message and sets autolaunch on
  */
  setAutoLaunchOn = () => {
    ipcRenderer.send('asynchronous-message', 'autolaunch.on');
  };
}

export default InstallerMessenger;
