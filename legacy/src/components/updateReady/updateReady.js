import { ipcRenderer } from 'electron';

const updateButton = document.getElementById('updateButton');
const closeButton = document.getElementById('closeButton');

updateButton.addEventListener('click', () => {
  ipcRenderer.send('applyUpdate');
  document.getElementById('updateReady').classList.add('hidden');
  document.getElementById('closing').classList.remove('hidden');
});

closeButton.addEventListener('click', () => {
  ipcRenderer.send('closeUpdateReady');
});
