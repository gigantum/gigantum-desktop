import path from 'path';
import {
  app,
  Menu,
  Tray,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
} from 'electron';
import isDev from 'electron-is-dev';
import { autoUpdater } from 'electron-updater';
import fs from 'fs';

import config from './config';
import GigDockerClient from './dockerClient';
import UiManager from './uiManager';
import trayIcons from './trayIcons';
import checkForUpdates from './updater';

let windows;
let tray;
let contextMenu;
let uiManager;
const fsData = {};
fsData.acknowledgements = fs.readFileSync(`${path.join(__dirname, 'gigantum.licenses.md')}`, 'utf8');
fsData.releaseNotes = fs.readFileSync(`${path.join(__dirname, 'gigantum.releaseNotes.md')}`, 'utf8');

const dockerClient = new GigDockerClient();

const mainWindow = null;
const isSecondInstance = app.makeSingleInstance(
  () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  },
);

if (isSecondInstance) {
  app.quit();
}

app.on('ready', () => {
  windows = {};
  tray = new Tray(trayIcons('busy'));

  config.windows.forEach((windowName, index) => {
    let h = 420;
    if (windowName === 'updateInfo' ){
      h = 650
    }

    windows[windowName] = new BrowserWindow({
      show: false,
      width: 750,
      height: h,
      resizable: false,
    });

    windows[windowName].on('close', (event) => {
      if (!app.quitting) {
        event.preventDefault();
        windows[windowName].hide();
      }
    });
    windows[windowName].webContents.on('will-navigate', (event, url) => {
      event.preventDefault();
      shell.openExternal(url);
    });
    windows[windowName].loadURL(
      `file://${path.join(__dirname, `./components/${windowName}/${windowName}.html`)}`,
      {"extraHeaders" : "pragma: no-cache\n"}
    );
    windows[windowName].session && windows[windowName].session.clearCache();
  });

  contextMenu = Menu.buildFromTemplate([
    {
      label: 'Gigantum is starting',
      enabled: false,
      id: 'starting',
      visible: true,
    },
    {
      label: 'Gigantum is running',
      id: 'running',
      enabled: false,
      visible: false,
    },
    {
      label: 'Gigantum is not running',
      id: 'notRunning',
      enabled: false,
      visible: false,
    },
    {
      label: 'Gigantum is closing',
      id: 'closing',
      enabled: false,
      visible: false,
    },
    {
      label: 'Error: Docker is not running',
      id: 'dockerNotRunning',
      visible: false,
      click: () => {
        windows.docker.show();
      },
    },
    {
      label: 'Error: Container is not running',
      id: 'containerNotRunning',
      visible: false,
    },
    {
      label: 'Error: Gigantum client not installed',
      id: 'imageNotInstalled',
      visible: false,
      click: () => {
        windows.install.show();
      },
    },
    {
      label: 'Error: Port in use',
      id: 'portInUse',
      visible: false,
      click: () => {
        windows.portInUse.show();
      },
    },
    {
      type: 'separator',
    },
    {
      id: 'openWindow',
      label: 'Open Gigantum Window',
      enabled: false,
      click: () => {
        shell.openExternal(config.defaultUrl);
      },
    },
    {
      label: 'Check for Updates',
      id: 'update',
      click: () => {
        dockerClient.dockerConnectionTest().then((res) => {
          if (res) {
          checkForUpdates(uiManager, true);
          } else {
            dialog.showMessageBox({
              title: 'Unable to check for Updates',
              message: 'Docker connection must be established to check for updates.',
            });
          }
        });
      },
    },
    {
      label: 'Help',
      click: () => {
        shell.openExternal('https://docs.gigantum.com/');
      },
    },
    {
      label: 'About',
      click: () => {
        windows.about.show();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Restart',
      enabled: false,
      id: 'restart',
      click: () => {
        dockerClient.dockerConnectionTest().then((res) => {
          if (res) {
            dockerClient.inspectGigantum().then((response) => {
              if (response && response.State.Running) {
                windows.restarting.show();
              } else {
                uiManager.setupApp();
              }
            });
          } else {
            uiManager.setupApp();
          }
        });
      },
    },
    {
      label: 'Quit',
      // We set a flag here so windows can avoid the 'hide' logic
      click: () => {
        dockerClient.inspectGigantum().then((response) => {
          if (response) {
            windows.closing.show();
          }
        })
        .catch(() => {
          dockerClient.handleAppQuit(false);
        });
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  uiManager = new UiManager(contextMenu, tray, windows, dockerClient);
  dockerClient.setUiManager(uiManager);
  dockerClient.setupDocker();
});


ipcMain.on('tryAgain', () => {
  uiManager.setupApp();
});

ipcMain.on('closeProgram', () => {
  windows.closing.setSize(750, 250);
  dockerClient
    .stopGigantum()
    .then(() => dockerClient.stopLabbooks(true))
    .then(() => {
      dockerClient.handleAppQuit(false);
    });
});

ipcMain.on('cancelClose', () => {
  windows.closing.hide();
});

ipcMain.on('cancelDockerWindow', () => {
  windows.docker.hide();
});

ipcMain.on('cancelInstallWindow', () => {
  windows.install.hide();
});

ipcMain.on('cancelUpdateWindow', () => {
  windows.update.hide();
});

ipcMain.on('installImage', () => {
  dockerClient.pullGigantum('install');
});

ipcMain.on('updateImage', () => {
  dockerClient.pullGigantum('update');
});

ipcMain.on('restartProgram', () => {
  windows.restarting.setSize(750, 250);
  dockerClient.restartGigantum();
});

ipcMain.on('cancelRestart', () => {
  windows.restarting.hide();
});

ipcMain.on('cancelUpdateInfo', () => {
  windows.updateInfo.hide();
});

ipcMain.on('applyUpdate', () => {
  windows.updateReady.setSize(750, 250);
  dockerClient.handleAppQuit(true);
});

ipcMain.on('closeUpdateReady', () => {
  windows.updateReady.hide();
});

ipcMain.on('openAcknowledgements', () => {
  windows.acknowledgements.show();
  windows.acknowledgements.webContents.send('file-open', fsData.acknowledgements);
});

ipcMain.on('openReleaseNotes', () => {
  windows.releaseNotes.show();
  windows.releaseNotes.webContents.send('file-open', fsData.releaseNotes);
});

ipcMain.on('updateGigantum', (evt, tag) => {
  dockerClient.pullGigantum('update', tag);
  autoUpdater.downloadUpdate();
  windows.updateInfo.hide();
});
