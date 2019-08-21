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
}

export default InstallerMessenger;
