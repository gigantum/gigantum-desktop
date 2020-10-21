import { ipcRenderer } from 'electron';

class ServerMesseneger {
  /**
    @param {Function} - callback
    ServerMessenger recieves message and updates UI
  */
  checkUpdatesResponse = callback => {
    ipcRenderer.on('recheck.servers', () => callback());
  };
}

export default ServerMesseneger;
