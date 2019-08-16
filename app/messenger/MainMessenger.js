import { ipcMain, BrowserWindow } from 'electron';
import Storage from '../storage/Storage';

const TRAY_ARROW_HEIGHT = 5;

const appPath = 'app.html';

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

  // Commented out for development purposes

  // toolbarWindow.on('blur', () => {
  //   if (!toolbarWindow.webContents.isDevToolsOpened()) {
  //     toolbarWindow.hide();
  //   }
  //   toolbarWindow.hide();
  // });
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
  const y = trayPos.y + TRAY_ARROW_HEIGHT;

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  } else {
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

/**
  @param {Object} currentWindow
  hides currentWindow
*/
const hideWindow = currentWindow => {
  currentWindow.hide();
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
    installerWindow.loadURL(`file://${__dirname}/../${appPath}?installer`);

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
    @param {} -
    sets up listener on messages and hides or shows depending on the message structure
  */
  listeners = () => {
    ipcMain.on('asynchronous-message', (evt, message) => {
      const { installerWindow, app } = this.contents;

      if (message === 'open.installer') {
        if (installerWindow) {
          showWindow(installerWindow);
        } else {
          this.initializeInstalledWindow();
        }
      }

      if (message === 'hide.installer') {
        hideWindow(installerWindow);
      }
      if (message === 'quit.app') {
        app.quit();
      }
    });
  };
}

export default MainMessenger;

export { showToolbar, toolbarLaunch, toggleWindow };
