import { ipcRenderer } from 'electron';
import config from '../../config.js';

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const installHeader = document.getElementById('installHeader');
const byteDictionary = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
let allowChangeUsedSize = null;
let usedSize = 0;

ipcRenderer.on('message', (event, incoming) => {
  if (!incoming.doneDownloading) {
    usedSize = incoming.downloadSize > config.fileSize ? config.fileSize : incoming.downloadSize > usedSize ? incoming.downloadSize : usedSize;
    installHeader.innerHTML = 'Downloading Gigantum Client';
  } else {
    if(allowChangeUsedSize === null){
      allowChangeUsedSize = true;
    }
    usedSize = incoming.extractSize > config.fileSize ? config.fileSize : ((allowChangeUsedSize) || (incoming.extractSize > usedSize)) ? incoming.extractSize : usedSize;
    installHeader.innerHTML = 'Extracting Gigantum Client';
    allowChangeUsedSize = false;
  }

  const fileSize = (Math.log10(usedSize) / 3);
  const maxSize = (Math.log10(config.fileSize) / 3);
  let percentage = Math.floor((usedSize / config.fileSize) * 100);
  percentage = percentage > 100 ? 100 : percentage;
  progressBar.value = usedSize;
  progressBar.max = config.fileSize;
  progressText.innerHTML = `${(usedSize / (Math.pow(1000, Math.floor(fileSize)))).toFixed(2)} / ${(config.fileSize / (Math.pow(1000, Math.floor(maxSize)))).toFixed(2)} ${byteDictionary[~~(maxSize)]} - ${percentage}%`;
});
