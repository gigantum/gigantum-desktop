import { ipcRenderer } from 'electron';
import config from '../../config.js';

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const installHeader = document.getElementById('installHeader');
const byteDictionary = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];

ipcRenderer.on('message', (event, incoming) => {
  let usedSize;
  if (!incoming.doneDownloading) {
    usedSize = incoming.downloadSize;
    installHeader.innerHTML = 'Downloading Gigantum Image';
  } else {
    usedSize = incoming.extractSize < config.fileSize ? incoming.extractSize : config.fileSize;
    installHeader.innerHTML = 'Extracting Gigantum Image';
  }

  const fileSize = (Math.log10(usedSize) / 3);
  const maxSize = (Math.log10(config.fileSize) / 3);
  progressBar.value = usedSize;
  progressBar.max = config.fileSize;
  progressText.innerHTML = `${(usedSize / (Math.pow(1000, Math.floor(fileSize)))).toFixed(2)} / ${(config.fileSize / (Math.pow(1000, Math.floor(maxSize)))).toFixed(2)} ${byteDictionary[~~(maxSize)]} - ${Math.floor((usedSize / config.fileSize) * 100)}%`;
});
