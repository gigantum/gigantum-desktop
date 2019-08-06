import { ipcMain } from 'electron';

const TRAY_ARROW_HEIGHT = 5;

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

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
  }

  // const currentDisplay = screen.getDisplayNearestPoint({ x, y: TRAY_ARROW_HEIGHT });
  // toolbarWindow.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y, false);
  toolbarWindow.setVisibleOnAllWorkspaces(true);
  toolbarWindow.setPosition(x, TRAY_ARROW_HEIGHT, false);
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
    this.props = { ...props };
  }

  /**
    @param {} -
    sets up listener on messages and hides or shows depending on the message structure
  */
  listeners = () => {
    ipcMain.on('asynchronous-message', (evt, message) => {
      const { installerWindow } = this.props;

      if (message === 'open.installer') {
        showWindow(installerWindow);
      }

      if (message === 'hide.installer') {
        hideWindow(installerWindow);
      }
    });
  };
}

export default MainMessenger;

export { showToolbar, toolbarLaunch, toggleWindow };
