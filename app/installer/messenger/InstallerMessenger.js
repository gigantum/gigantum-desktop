import { ipcRenderer } from 'electron';

class InstallerMessenger {
  /**
    @param {} -
    sends hide.installer to ipcRenderer
    MainMessenger recieves message and hides installer window
  */
  hideInstaller = () => {
    ipcRenderer.send('asynchronous-message', 'hide.installer');
  };
}

export default InstallerMessenger;
