// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildDarwinTemplate = () => {
    const subMenuAbout = {
      label: 'Gigantum',
      submenu: [
        {
          label: 'About Gigantum',
          selector: 'orderFrontStandardAboutPanel:',
          click: () => {
            shell.openExternal('https://gigantum.com/about');
          }
        },
        { type: 'separator' },
        {
          label: 'Hide Gigantum',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };

    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Blog',
          click() {
            shell.openExternal('https://blog.gigantum.com/');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://docs.gigantum.com/');
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://spectrum.chat/gigantum/?tab=posts');
          }
        },
        {
          label: 'Feedback',
          click() {
            shell.openExternal('https://feedback.gigantum.com');
          }
        }
      ]
    };
    return [subMenuAbout, subMenuHelp];
  };

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Blog',
            click() {
              shell.openExternal('https://blog.gigantum.com/');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://docs.gigantum.com/');
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://spectrum.chat/gigantum/?tab=posts');
            }
          },
          {
            label: 'Feedback',
            click() {
              shell.openExternal('https://feedback.gigantum.com');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
