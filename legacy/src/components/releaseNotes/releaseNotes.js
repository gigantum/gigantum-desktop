import marked from 'marked'
import { ipcRenderer } from 'electron';


ipcRenderer.on('file-open', (event, filedata) => {
  document.getElementById('content').innerHTML = marked(filedata);
});

