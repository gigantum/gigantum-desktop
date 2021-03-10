// vendor
import { app, Menu, shell } from 'electron';
// libs
import Gigantum from '../libs/Gigantum';

const gigantum = new Gigantum();

const createContextMenu = (tray, toolbarWindow, mainMessenger) => {
  tray.on('right-click', () => {
    const callback = response => {
      const isRunning = response.success;

      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'About',
          click: () => {
            mainMessenger.contents.aboutWindow.show();
          }
        },
        {
          label: 'Feedback',
          click: () => {
            shell.openExternal(
              'https://docs.google.com/forms/d/e/1FAIpQLSe5VoZRDg0jukwjWUuR4y8oviFP6S1HFx0z9i00ilrJOQaLnw/viewform'
            );
          }
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          click: () => {
            mainMessenger.contents.preferencesWindow.show();
          }
        },
        { type: 'separator' },
        {
          label: '&Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            toolbarWindow.show();
          }
        },
        {
          label: isRunning ? '&Stop Gigantum' : '&Start Gigantum',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (isRunning) {
              gigantum.stopGigantum();
            } else {
              toolbarWindow.webContents.send('start-gigantum');
            }
          }
        },
        {
          label: '&Quit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
            toolbarWindow.show();
          }
        }
      ]);
      tray.setContextMenu(contextMenu);
      tray.popUpContextMenu();

      toolbarWindow.hide();
    };

    try {
      gigantum.checkGigantumRunning(callback);
    } catch (error) {
      console.log(error);
    }
  });
};

export default createContextMenu;
