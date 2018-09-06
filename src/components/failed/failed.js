import { ipcRenderer, shell } from 'electron';

const cancelButton = document.getElementById('cancel');

function openLink() {
    shell.openExternal('https://docs.gigantum.com/docs/client-interface-fails-to-load');
}

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelFailedWindow');
});
