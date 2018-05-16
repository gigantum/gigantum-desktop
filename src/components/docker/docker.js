// @flow
import { ipcRenderer, shell } from 'electron';
import os from 'os';

const platform = os.platform();

const cancelButton = document.getElementById('cancel');

function openOSLink() {
  switch (platform) {
    case 'darwin':
      shell.openExternal('https://docs.gigantum.com/docs/mac-installation');
      break;
    case 'win32':
      shell.openExternal('https://docs.gigantum.com/docs/windows-installation');
      break;
    case 'linux':
      shell.openExternal('https://docs.gigantum.com/docs/linux-installation');
      break;
    default:
      break;
  }
}

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelDockerWindow');
});
