import { ipcMain, screen } from 'electron';

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

  // Commented out for development purposes
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
  let y = 0;
  console.log(
    trayPos,
    windowPos.height,
    windowPos.width,
    screen.getDisplayNearestPoint(trayPos)
  );

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = TRAY_ARROW_HEIGHT;
  } else {
    const screenInfo = screen.getDisplayNearestPoint(trayPos);
    const isAtRight =
      screenInfo.workArea.width < trayPos.x &&
      screenInfo.workArea.height === screenInfo.size.height;
    const isAtBottom =
      screenInfo.workArea.height < trayPos.y + trayPos.height &&
      screenInfo.workArea.width === screenInfo.size.width;
    const isAtTop =
      screenInfo.workArea.y > trayPos.y &&
      screenInfo.workArea.width === screenInfo.size.width;
    const isAtLeft =
      screenInfo.workArea.x > trayPos.x &&
      screenInfo.workArea.height === screenInfo.size.height;

    if (isAtRight) {
      // right
      x = screenInfo.workArea.width - windowPos.width - TRAY_ARROW_HEIGHT;
      y =
        y + windowPos.height > y - windowPos.height
          ? screenInfo.workArea.height - windowPos.height - 50
          : y;
    } else if (isAtBottom) {
      // bottom
      x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
      y = screenInfo.workArea.height - windowPos.height - TRAY_ARROW_HEIGHT;
    } else if (isAtTop) {
      x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
      y = screenInfo.workArea.y + TRAY_ARROW_HEIGHT;
    } else if (isAtLeft) {
      x = screenInfo.workArea.x + TRAY_ARROW_HEIGHT;
      y = Math.round(trayPos.y + trayPos.height - windowPos.height / 2);
      y =
        y + windowPos.height > y - windowPos.height
          ? screenInfo.workArea.height - windowPos.height - 50
          : y;
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
