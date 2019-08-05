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
import { app, BrowserWindow, Tray, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import Storage from './storage/Storage';

const TRAY_ARROW_HEIGHT = -5;

// systemPreferences.subscribeNotification(
//   'AppleInterfaceThemeChangedNotification',
//   function theThemeHasChanged () {
//     updateMyAppTheme(systemPreferences.isDarkMode())
//   }
// )

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

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

const toggleWindow = (toolbarWindow, tray) => {
  if (toolbarWindow.isVisible()) {
    toolbarWindow.hide();
  } else {
    showWindow(toolbarWindow, tray);
  }
};

const toolbarLaunch = (toolbarWindow, tray) => {
  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  tray.on('click', event => {
    toggleWindow(toolbarWindow, tray);
    // Show devtools when command clicked
    if (toolbarWindow.isVisible() && process.defaultApp && event.metaKey) {
      toolbarWindow.openDevTools({ mode: 'detach' });
    }
  });

  toolbarWindow.on('blur', () => {
    if (!toolbarWindow.webContents.isDevToolsOpened()) {
      toolbarWindow.hide();
    }
    toolbarWindow.hide();
  });
};

const showWindow = (toolbarWindow, tray) => {
  const trayPos = tray.getBounds();
  const windowPos = toolbarWindow.getBounds();
  let x = 0;

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  }

  // const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  // win.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y, false);
  toolbarWindow.setVisibleOnAllWorkspaces(true);
  toolbarWindow.setPosition(x, TRAY_ARROW_HEIGHT, false);
  toolbarWindow.show();
  toolbarWindow.focus();
};

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: 300,
    height: 500,
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
  const storage = new Storage();
  const install = storage.get('install');
  const appPath = install.complete
    ? 'toolbar/toolbar.html'
    : 'installer/installer.html';

  const icon = nativeImage.createFromDataURL(gigantumBase64);
  const tray = new Tray(icon);

  if (install.complete) {
    toolbarLaunch(mainWindow, tray);
  }
  mainWindow.loadURL(`file://${__dirname}/${appPath}`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  //
  //

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      if (install.complete) {
        showWindow(mainWindow, tray);
      }
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});

let gigantumBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABCElEQVQ4jZXTTStFURTG8Z+XGBgxlDKhjHwAZWBqpgyVMlRERkz5FGbmjCRTfAYD5KWQpEgJI9G+d5869551XZ56Onvvtf6rdc5ZW6ABrOMEN/jO3kFfNb1RSyWg8Cc2MYHeClHSdgBf547aaiOAk6fbgR0YxRk6m2LnGMvrOUzhFK/owhEuuzEfwEkPpfVHLrDQlJPOHAetJ18FhfuxV8rZT4d3AVx4ttJXXWs5/px29wFY+BFDFbyuw5xTG5gILvyGVQyiB8NYybGXVGArgCJ/4T0/i/hBKjDSdPgfLxbv02qQfnOa0obRjkb5N09GX3b5D2C6oeMt/kxN5et8iydcYBczDZn4AcjljXDWYFm9AAAAAElFTkSuQmCC';
