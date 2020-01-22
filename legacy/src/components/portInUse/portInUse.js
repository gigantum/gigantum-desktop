import { ipcRenderer } from 'electron';

const tryAgainButton = document.getElementById('tryAgainButton');

tryAgainButton.addEventListener('click', () => {
  ipcRenderer.send('tryAgain');
});
