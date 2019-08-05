import os from 'os';
import path from 'path';

export default (status) => {
  const iconFolder = path.join(__dirname, 'assets');
  const platform = os.platform();
  let trayImage;
  if (platform === 'darwin') {
    trayImage = `${iconFolder}/osx/icon-${status}Template.png`;
  } else if (platform === 'win32' || platform === 'linux') {
    trayImage = `${iconFolder}/win/icon-${status}.png`;
  }
  return trayImage;
};
