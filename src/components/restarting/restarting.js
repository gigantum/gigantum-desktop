// @flow
import { ipcRenderer } from 'electron';

const continueButton = document.getElementById('continue');
const cancelButton = document.getElementById('cancel');

continueButton.addEventListener('click', () => {
  ipcRenderer.send('restartProgram');
  document.getElementById('restartConfirm').classList.add('hidden');
  document.getElementById('restarting').classList.remove('hidden');
});

ipcRenderer.on('message', (event, incoming) => {
  document.getElementById('restartConfirm').classList.remove('hidden');
  document.getElementById('restarting').classList.add('hidden');
});

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelRestart');
});
