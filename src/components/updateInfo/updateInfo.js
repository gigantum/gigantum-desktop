import { ipcRenderer } from 'electron';

const cancelButton = document.getElementById('cancel');
const installUpdateButton = document.getElementById('installUpdateButton');
const releaseNotes = document.getElementById('releaseNotes');
const version = document.getElementById('version');
let tag = null;

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelUpdateInfo');
});

installUpdateButton.addEventListener('click', () => {
  ipcRenderer.send('updateGigantum', tag);
});


ipcRenderer.on('message', (event, incoming) => {
  version.innerHTML = `New Version: ${incoming.version}`;
  releaseNotes.innerHTML = incoming.releaseNotes;
  tag = incoming.releaseNotes.split('\n')[0].split(':')[1].slice(1,9)
});