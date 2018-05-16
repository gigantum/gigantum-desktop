// @flow
import { ipcRenderer } from 'electron';

const continueButton = document.getElementById('continue');
const cancelButton = document.getElementById('cancel');

continueButton.addEventListener('click', () => {
  ipcRenderer.send('closeProgram');
  document.getElementById('closeConfirm').classList.add('hidden');
  document.getElementById('closing').classList.remove('hidden');
});

cancelButton.addEventListener('click', () => {
  ipcRenderer.send('cancelClose');
});
