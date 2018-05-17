import { ipcRenderer } from 'electron';
import config from '../../config.js';

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const installHeader = document.getElementById('installHeader');
const byteDictionary = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'];
let isDownloaded = false;
let newImageSize;


ipcRenderer.on('message', (event, incoming) => {
  if(incoming.newImageSize) {
    newImageSize = incoming.newImageSize;
  }
  if(incoming.isDownloaded) {
    isDownloaded = true;
  }
  if(isDownloaded){
    let usedSize;
    if (!incoming.doneDownloading) {
      usedSize = incoming.downloadSize;
      installHeader.innerHTML = 'Downloading New Gigantum Client';

    } else {
      usedSize = incoming.extractSize < newImageSize ? incoming.extractSize : newImageSize;
      installHeader.innerHTML = 'Extracting New Gigantum Client';
    }

    const fileSize = (Math.log10(usedSize) / 3);
    const maxSize = (Math.log10(newImageSize) / 3);
    progressBar.value = usedSize;
    progressBar.max = newImageSize;
    progressText.innerHTML = `${(usedSize / (Math.pow(1000, Math.floor(fileSize)))).toFixed(2)} / ${(newImageSize / (Math.pow(1000, Math.floor(maxSize)))).toFixed(2)} ${byteDictionary[~~(maxSize)]} - ${Math.floor((usedSize / newImageSize) * 100)}%`;
  } else {
    if(!incoming.downloadSize) {
    installHeader.innerHTML = 'Downloading Updated App';
    const fileSize = (Math.log10(incoming.transferred) / 3);
    const maxSize = (Math.log10(incoming.total) / 3);
    progressBar.value = incoming.transferred;
    progressBar.max = incoming.total;
    progressText.innerHTML = `${(incoming.transferred / (Math.pow(1000, Math.floor(fileSize)))).toFixed(2)} / ${(incoming.total / (Math.pow(1000, Math.floor(maxSize)))).toFixed(2)} ${byteDictionary[~~(maxSize)]} - ${Math.floor((incoming.transferred / incoming.total) * 100)}%`;
    }
  }
});

