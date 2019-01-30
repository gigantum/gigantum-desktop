import { ipcRenderer, shell } from 'electron';

const cancelButton = document.getElementById('cancel');


cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelDiskSpaceWindow');
});
