/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Menu, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import isDev from 'electron-is-dev';
import MenuBuilder from './menu';
import Storage from './storage/Storage';
import MainMessenger, {
  showToolbar,
  toolbarLaunch
} from './messenger/MainMessenger';
import checkForUpdates from './updater';

const isWindows = process.platform === 'win32';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(error => {
    console.log(error);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  const storage = new Storage();
  const install = storage.get('install');
  const appPath = 'app.html';
  const icon = isWindows
    ? `${__dirname}/assets/tray/iconWhite.png`
    : `${__dirname}/assets/tray/iconTemplate.png`;
  const tray = new Tray(icon);

  if (process.platform === 'linux') {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Gigantum',
        click: () => {
          showToolbar(toolbarWindow, tray);
        }
      }
    ]);
    tray.setContextMenu(contextMenu);
  }

  const toolbarWindow = new BrowserWindow({
    name: 'toolbar',
    width: 352,
    height: 409,
    transparent: true,
    resizable: false,
    frame: false,
    show: false,
    alwaysOnTop: true,
    fullscreenable: false,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  const mainMessenger = new MainMessenger({
    tray,
    toolbarWindow,
    app
  });

  if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
  }

  mainMessenger.listeners();
  toolbarWindow.checkForUpdates = () => checkForUpdates(mainMessenger, false);
  toolbarLaunch(toolbarWindow, tray);

  toolbarWindow.loadURL(`file:///${__dirname}/${appPath}?toolbar`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  //
  //

  toolbarWindow.webContents.on('did-finish-load', () => {
    if (!toolbarWindow) {
      throw new Error('"toolbarWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      toolbarWindow.minimize();
    } else if (install) {
      showToolbar(toolbarWindow, tray);
    }
  });

  toolbarWindow.on('closed', () => {});

  const menuBuilder = new MenuBuilder(toolbarWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
});
