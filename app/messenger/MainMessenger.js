import { ipcMain, BrowserWindow, screen, nativeImage } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import checkForUpdates from '../updater';
import Storage from '../storage/Storage';

const isWindows = process.platform === 'win32';

const TRAY_ARROW_HEIGHT = 5;

const icon = nativeImage.createFromPath(`${__dirname}/../assets/tray/icon.png`);
icon.setTemplateImage(true);

const appPath = process.env.HOT
  ? `file:///${__dirname}/../app.html`
  : `file:///${__dirname}/app.html`;

/**
  @param {Object} toolbarWindow
  @param {Tray} toolbarWindow
  toggles window, hides if visible
  @calls {showToolbar} -
  if toolbar is hidden calls showToolbar
*/
const toggleWindow = (toolbarWindow, tray) => {
  if (toolbarWindow.isVisible()) {
    toolbarWindow.hide();
  } else {
    showToolbar(toolbarWindow, tray);
  }
};

/**
  @param {Object} toolbarWindow
  @param {Tray} toolbarWindow
  launches toolbar and adds on blur and click events
*/
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

/**
  @param {Object} toolbarWindow
  @param {Tray} toolbarWindow
  shows toolbar and achors to a point on the screen below tray
*/
const showToolbar = (toolbarWindow, tray) => {
  const trayPos = tray.getBounds();
  const windowPos = toolbarWindow.getBounds();
  let x = 0;
  let y = trayPos.y + TRAY_ARROW_HEIGHT;
  const display = screen.getPrimaryDisplay();
  const adjustedMax = display.bounds.width - 352;

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  } else {
    y = trayPos.y - 409;
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  }
  if (process.platform === 'linux') {
    x = adjustedMax;
  }
  if (process.platform === 'win32') {
    if (x < 0) {
      x = 0;
    }
    if (x > adjustedMax) {
      x = adjustedMax;
    }
  }

  toolbarWindow.setVisibleOnAllWorkspaces(true);
  toolbarWindow.setPosition(x, y, false);
  toolbarWindow.show();
  toolbarWindow.focus();
};

/**
  @param {Object} currentWindow
  shows current window
*/
const showWindow = currentWindow => {
  currentWindow.setVisibleOnAllWorkspaces(true);
  currentWindow.show();
  currentWindow.focus();
};

class MainMessenger {
  constructor(props) {
    this.contents = { ...props };
    const storage = new Storage();
    const install = storage.get('install');
    if (!install) {
      this.initializeInstalledWindow();
    }
  }

  /**
  @param {Object} - changeLog
  creates updater window
  */
  initializeUpdaterWindow = changeLog => {
    const updaterWindow = new BrowserWindow({
      allowEval: true,
      name: 'updater',
      width: 669,
      height: 455,
      transparent: true,
      resizable: false,
      frame: false,
      show: false,
      alwaysOnTop: false,
      icon,
      fullscreenable: false,
      webPreferences: {
        backgroundThrottling: false
      }
    });

    updaterWindow.loadURL(`${appPath}?updater`);
    updaterWindow.changeLog = changeLog;
    updaterWindow.webContents.on('did-finish-load', () => {
      if (!updaterWindow) {
        throw new Error('"updaterWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        updaterWindow.minimize();
      } else {
        updaterWindow.show();
        updaterWindow.focus();
      }
    });
    this.contents.updaterWindow = updaterWindow;
  };

  /**
  @param {} -
  creates installer window
  */
  initializeInstalledWindow = () => {
    const installerWindow = new BrowserWindow({
      name: 'installer',
      width: 1033,
      height: 525,
      transparent: true,
      resizable: false,
      frame: false,
      show: false,
      icon,
      alwaysOnTop: false,
      fullscreenable: false,
      webPreferences: {
        backgroundThrottling: false
      }
    });
    installerWindow.loadURL(`${appPath}?installer`);

    installerWindow.webContents.on('did-finish-load', () => {
      if (!installerWindow) {
        throw new Error('"installerWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        installerWindow.minimize();
      } else {
        installerWindow.show();
        installerWindow.focus();
      }
    });
    this.contents.installerWindow = installerWindow;
  };

  /**
  @param {String} section
  creates settings window
  */
  sendChangeLog = changeLog => {
    const { updaterWindow } = this.contents;
    if (updaterWindow) {
      showWindow(updaterWindow);
    } else {
      this.initializeUpdaterWindow(changeLog);
    }
  };

  /**
  @param {Boolean} updateFound
  sends update response to renderer
  */
  sendUpdateResponse = updateFound => {
    const { toolbarWindow } = this.contents;
    toolbarWindow.webContents.send('asynchronous-message', updateFound);
  };

  /**
  @param {Object} progress
  sends downlad progress to renderer
  */
  sendDownloadProgress = progress => {
    const { updaterWindow } = this.contents;
    updaterWindow.webContents.send('asynchronous-message', progress);
  };

  /**
  @param {}
  sets downlad status to renderer
  */
  setDownloadStatus = () => {
    const { toolbarWindow } = this.contents;
    toolbarWindow.downloadComplete = true;
  };

  /**
    @param {} -
    sets up listener on messages and hides or shows depending on the message structure
  */
  listeners = () => {
    const { app, tray } = this.contents;
    app.on('before-quit', evt => {
      if (!this.allowQuit) {
        this.contents.toolbarWindow.webContents.send('quit.app');
        evt.preventDefault();
      }
    });

    app.on('window-all-closed', () => {
      // Respect the OSX convention of having the application in memory even
      // after all windows have been closed
      if (process.platform !== 'darwin') {
        this.allowQuit = true;
        tray.destroy();
        app.quit();
      }
    });

    ipcMain.on('asynchronous-message', (evt, message) => {
      const {
        installerWindow,
        updaterWindow,
        aboutWindow,
        preferencesWindow,
        toolbarWindow
      } = this.contents;

      if (message === 'open.installer') {
        if (installerWindow) {
          showWindow(installerWindow);
        } else {
          this.initializeInstalledWindow();
        }
      }

      if (message === 'open.toolbar') {
        if (toolbarWindow) {
          showWindow(toolbarWindow);
        }
      }

      if (message === 'close.installer') {
        if (installerWindow) {
          installerWindow.close();
          delete this.contents.installerWindow;
        }
        if (toolbarWindow) {
          showToolbar(toolbarWindow, tray);
          toolbarWindow.webContents.send('start-gigantum');
        }
      }

      if (message === 'close.updater') {
        if (updaterWindow) {
          updaterWindow.close();
          delete this.contents.updaterWindow;
        }
      }

      if (message === 'open.about') {
        if (aboutWindow) {
          aboutWindow.show();
          aboutWindow.focus();
        }
      }

      if (message === 'open.preferences') {
        if (preferencesWindow) {
          preferencesWindow.show();
          preferencesWindow.focus();
        }
      }

      if (message === 'close.settings') {
        if (preferencesWindow) {
          preferencesWindow.hide();
        }
        if (aboutWindow) {
          aboutWindow.hide();
        }
      }

      if (message === 'autolaunch.off') {
        if (isWindows) {
          const exeName = path.basename(process.execPath);
          this.contents.app.setLoginItemSettings({
            openAtLogin: false,
            path: process.execPath,
            args: [
              '--processStart',
              `"${exeName}"`,
              '--process-start-args',
              `"--hidden"`
            ]
          });
        } else {
          this.contents.app.setLoginItemSettings({ openAtLogin: false });
        }
      }
      if (message === 'autolaunch.on') {
        if (isWindows) {
          const exeName = path.basename(process.execPath);
          this.contents.app.setLoginItemSettings({
            openAtLogin: true,
            path: process.execPath,
            args: [
              '--processStart',
              `"${exeName}"`,
              '--process-start-args',
              `"--hidden"`
            ]
          });
        } else {
          this.contents.app.setLoginItemSettings({ openAtLogin: true });
        }
      }

      if (message === 'quit.app') {
        this.allowQuit = true;
        tray.destroy();
        app.quit();
      }

      if (message === 'check.updates') {
        checkForUpdates(this, true);
      }
      if (message === 'download.update') {
        autoUpdater.downloadUpdate();
      }
      if (message === 'download.complete') {
        this.setDownloadStatus();
      }
      if (message === 'quit.andInstall') {
        autoUpdater.quitAndInstall();
      }
    });
  };
}

export default MainMessenger;

export { showToolbar, toolbarLaunch, toggleWindow };
