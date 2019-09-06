import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import checkForUpdates from '../updater';
import Storage from '../storage/Storage';

const TRAY_ARROW_HEIGHT = 5;

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

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  } else {
    y = trayPos.y - 409;
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
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
  initializeSettingsWindow = section => {
    const settingsWindow = new BrowserWindow({
      name: 'installer',
      width: 669,
      height: 405,
      transparent: false,
      resizable: false,
      frame: false,
      show: false,
      alwaysOnTop: false,
      fullscreenable: false,
      webPreferences: {
        backgroundThrottling: false
      }
    });
    settingsWindow.loadURL(`${appPath}?settings&section=${section}`);

    settingsWindow.webContents.on('did-finish-load', () => {
      if (!settingsWindow) {
        throw new Error('"settingsWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        settingsWindow.minimize();
      } else {
        settingsWindow.show();
        settingsWindow.focus();
      }
    });
    this.contents.settingsWindow = settingsWindow;
  };

  /**
  @param {String} section
  creates settings window
  */
  sendChangeLog = log => {
    const { updaterWindow } = this.contents;
    if (updaterWindow) {
      showWindow(updaterWindow);
    } else {
      this.initializeUpdaterWindow(log);
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
    ipcMain.on('asynchronous-message', (evt, message) => {
      const {
        installerWindow,
        updaterWindow,
        settingsWindow,
        app
      } = this.contents;

      if (message === 'open.installer') {
        if (installerWindow) {
          showWindow(installerWindow);
        } else {
          this.initializeInstalledWindow();
        }
      }

      if (message === 'close.installer') {
        if (installerWindow) {
          installerWindow.close();
          delete this.contents.installerWindow;
        }
      }

      if (message === 'close.updater') {
        if (updaterWindow) {
          updaterWindow.close();
          delete this.contents.updaterWindow;
        }
      }

      if (message === 'open.about') {
        if (settingsWindow) {
          settingsWindow.loadURL(`${appPath}?settings&section=about`);
          settingsWindow.show();
          settingsWindow.focus();
        } else {
          this.initializeSettingsWindow('about');
        }
      }

      if (message === 'open.preferences') {
        if (settingsWindow) {
          settingsWindow.loadURL(`${appPath}?settings&section=preferences`);
          settingsWindow.show();
          settingsWindow.focus();
        } else {
          this.initializeSettingsWindow('preferences');
        }
      }

      if (message === 'close.settings') {
        if (settingsWindow) {
          settingsWindow.close();
          delete this.contents.settingsWindow;
        }
      }

      if (message === 'quit.app') {
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
