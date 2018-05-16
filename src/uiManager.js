import os from 'os';
import trayIcons from './trayIcons';

export default class UiManager {
  constructor(contextMenu, tray, windows, dockerClient) {
    this.contextMenu = contextMenu;
    this.windows = windows;
    this.tray = tray;
    this.dockerClient = dockerClient;
    this.status = 'starting';
    this.error = null;
  }
  resetForLinux() {
    if (os.platform() === 'linux') {

      this.tray.setContextMenu(this.contextMenu);
    }
  }

  restartingEnabled(bool) {
    this.contextMenu.getMenuItemById('restart').enabled = bool;
    this.resetForLinux();
  }

  changeStatus(newStatus) {
    if (newStatus !== this.status) {
      this.contextMenu.getMenuItemById(this.status).visible = false;
      this.contextMenu.getMenuItemById(newStatus).visible = true;
      this.contextMenu.getMenuItemById('openWindow').enabled = false;
      this.contextMenu.getMenuItemById('restart').enabled = false;
      switch (newStatus) {
        case 'starting':
          this.tray.setToolTip('Gigantum is starting');
          this.tray.setImage(trayIcons('busy'));
          break;
        case 'running':
          this.tray.setToolTip('Gigantum is running');
          this.tray.setImage(trayIcons('main'));
          this.contextMenu.getMenuItemById('openWindow').enabled = true;
          this.contextMenu.getMenuItemById('restart').enabled = true;
          this.windows.restarting.webContents.send('message', true);
          this.windows.restarting.setSize(750, 420);
          this.windows.restarting.hide();
          break;
        case 'notRunning':
          this.tray.setToolTip('Gigantum is not running');
          this.tray.setImage(trayIcons('error'));
          this.contextMenu.getMenuItemById('restart').enabled = true;
          break;
        case 'closing':
          this.tray.setToolTip('Gigantum is closing');
          this.tray.setImage(trayIcons('busy'));
          break;
        default:
          break;
      }
      this.resetForLinux();
      this.status = newStatus;
    }
  }
  setupApp() {
    this.contextMenu.getMenuItemById('dockerNotRunning').visible = false;
    this.contextMenu.getMenuItemById('imageNotInstalled').visible = false;
    this.contextMenu.getMenuItemById('portInUse').visible = false;
    this.contextMenu.getMenuItemById('containerNotRunning').visible = false;
    Object.keys(this.windows).forEach((windowName) => {
      this.windows[windowName].hide();
    });
    this.changeStatus('starting');
    this.dockerClient.setupDocker();
    this.resetForLinux();
  }

  handleAppEvent(newEvent) {
    if (newEvent.tooltip) {
      this.tray.setToolTip(newEvent.toolTip);
    }
    if (newEvent.status) {
      this.changeStatus(newEvent.status);
    }
    if (newEvent.id) {
      this.contextMenu.getMenuItemById(newEvent.id).visible = true;
    }
    if (newEvent.window) {
      this.windows[newEvent.window].show();
    }
    if (newEvent.sendWindow) {
      this.windows[newEvent.window].webContents.send(newEvent.sendWindow.message, newEvent.sendWindow.content);
    }
    this.resetForLinux();
  }

  updateInstallImageWindow(progress, type) {
    this.windows[type].webContents.send('message', progress);
  }
  updateReady() {
    this.windows.update.hide();
    this.windows.updateReady.show();
  }
  destroyTray() {
    this.tray.destroy();
  }
}
