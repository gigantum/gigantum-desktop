import { ipcRenderer, shell } from 'electron';

const cancelButton = document.getElementById('cancel');

function openLink() {
    shell.openExternal('https://docs.gigantum.com/docs/client-troubleshooting');
}

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelFailedWindow');
});
