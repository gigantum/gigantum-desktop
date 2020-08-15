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
import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import isDev from 'electron-is-dev';
import MenuBuilder from './menu';
import Storage from './storage/Storage';
import MainMessenger, {
  showToolbar,
  toolbarLaunch
} from './messenger/MainMessenger';
import sentry from './sentry';
import checkForUpdates from './updater';

const icon = nativeImage.createFromPath(`${__dirname}/assets/tray/icon.png`);
icon.setTemplateImage(true);

const mainWindow = null;
const isSecondInstance = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (isSecondInstance) {
  app.quit();
}

sentry();

const isWindows = process.platform === 'win32';

const urlPath = `file:///${__dirname}/app.html`;

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

/**
@param {String} section
creates settings window
*/
const initializeSettingsWindow = (section, width, height) => {
  const settingsWindow = new BrowserWindow({
    name: section,
    width,
    height,
    transparent: false,
    resizable: false,
    frame: false,
    icon,
    show: false,
    alwaysOnTop: false,
    fullscreenable: false,
    webPreferences: {
      backgroundThrottling: false
    }
  });
  settingsWindow.loadURL(`${urlPath}?settings&section=${section}`);
  const options = {};
  if (isWindows) {
    const exeName = path.basename(process.execPath);
    options.path = process.exectPath;
    options.args = [
      '--processStart',
      `"${exeName}"`,
      '--process-start-args',
      `"--hidden"`
    ];
  }
  const { openAtLogin } = app.getLoginItemSettings(options);
  settingsWindow.openAtLogin = openAtLogin;
  settingsWindow.webContents.on('did-finish-load', () => {
    if (!settingsWindow) {
      throw new Error('"settingsWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      settingsWindow.minimize();
    }
  });
  return settingsWindow;
};

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
  const trayIcon = isWindows
    ? `${__dirname}/assets/tray/iconWhite.png`
    : `${__dirname}/assets/tray/iconTemplate.png`;
  const tray = new Tray(trayIcon);

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
    height: 444,
    transparent: true,
    resizable: false,
    frame: false,
    show: false,
    icon,
    alwaysOnTop: true,
    fullscreenable: false,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  });

  const aboutWindow = initializeSettingsWindow('about', 669, 405);
  const preferencesWindow = initializeSettingsWindow('preferences', 669, 405);
  const manageServerWindow = initializeSettingsWindow('manageServer', 669, 480);

  const mainMessenger = new MainMessenger({
    tray,
    toolbarWindow,
    aboutWindow,
    preferencesWindow,
    app,
    manageServerWindow
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
