import config from '../../config.js';
import { ipcRenderer } from 'electron';

const versionNumber = document.getElementById('versionNumber');
const clientVersion = document.getElementById('clientVersion');
const ImageTag = document.getElementById('ImageTag');
const releaseNotesButton = document.getElementById('releaseNotes');
const acknowledgementsButton = document.getElementById('acknowledgements');

releaseNotesButton.addEventListener('click', () => {
  ipcRenderer.send('openReleaseNotes');
});

acknowledgementsButton.addEventListener('click', () => {
  ipcRenderer.send('openAcknowledgements');
});


versionNumber.innerHTML = `Version: ${config.version}`;
clientVersion.innerHTML = `Gigantum Client Version: ${config.clientVersion}`;
ImageTag.innerHTML = `Image Tag: ${config.imageTag}`;
