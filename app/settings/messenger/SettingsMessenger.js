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
}

export default ToolbarMesseneger;
