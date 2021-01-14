// @flow
import React, { PureComponent } from 'react';
import { remote } from 'electron';
import utils from '../../../../libs/utilities';
// States
import {
  RUNNING,
  ERROR,
  STOPPED,
  LOADING,
  STARTING,
  STOPPING,
  STOP,
  FORCE_STOP
} from '../../../machine/ToolbarConstants';
// assets
import './Header.scss';

const { Menu } = remote;
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';
const removeWarning = isLinux || isWindows;

type Props = {
  machine: {
    value: ''
  },
  storage: {
    get: () => void
  },
  messenger: {
    quitApp: () => void,
    showAbout: () => void,
    showPreferences: () => void,
    checkQuitApp: () => void
  },
  interface: {
    stop: () => void,
    checkRunningProjects: () => void,
    check: () => void
  },
  transition: () => void
};

class Header extends PureComponent<Props> {
  props: Props;

  componentDidMount = () => {
    const { props } = this;
    const callback = () => this.handleQuit();
    // sets event listener
    props.messenger.checkQuitApp(callback);
  };

  /**
    @param {} -
    handles app quit
  */
  handleQuit = () => {
    const { props } = this;
    const { storage, messenger } = props;
    const stopCallback = () => {
      messenger.quitApp(props.interface);
    };
    const gigantumRunningCallback = () => {
      props.interface.checkRunningProjects(checkRunningProjectsCallback);
    };
    const checkRunningProjectsCallback = response => {
      let validateGigantumClose = !storage.get('close.gigantumConfirm');
      const shouldCloseDockerConfig = removeWarning
        ? false
        : storage.get('close.dockerConfirm');
      const validateDockerClose = shouldCloseDockerConfig === undefined;
      if (response.success) {
        validateGigantumClose = false;
      }
      if (validateGigantumClose) {
        props.transition(STOP, {
          message: 'Are you sure?',
          category: 'close.gigantum',
          quittingApp: true
        });
      } else if (validateDockerClose) {
        props.transition(STOP, {
          message: 'Would you like to close Docker?',
          category: 'close.docker',
          quittingApp: true
        });
      } else {
        props.transition(FORCE_STOP, {
          message: 'Stopping Gigantum'
        });
        props.interface.stop(stopCallback, shouldCloseDockerConfig);
      }
    };

    props.interface.check(stopCallback, gigantumRunningCallback);
  };

  menu = Menu.buildFromTemplate([
    {
      label: 'About',
      click: () => {
        const { messenger } = this.props;
        messenger.showAbout();
      }
    },
    {
      label: 'Feedback',
      click: () => {
        utils.open('https://feedback.gigantum.com');
      }
    },
    { type: 'separator' },
    {
      label: 'Preferences',
      click: () => {
        const { messenger } = this.props;
        messenger.showPreferences();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => this.handleQuit()
    }
  ]);

  render() {
    const { props } = this;
    const renderMap = {
      [STARTING]: <div>is starting</div>,
      [RUNNING]: <div>is running</div>,
      [STOPPED]: <div />,
      [STOPPING]: <div>is stopping</div>,
      [ERROR]: <div />,
      [LOADING]: <div />
    };

    return (
      <div className="Header">
        <div className="Header__Logo" />
        {renderMap[props.machine.value]}
        <div
          className="Header__Menu"
          onClick={() => this.menu.popup({ window: remote.getCurrentWindow() })}
          onKeyDown={() =>
            this.menu.popup({ window: remote.getCurrentWindow() })
          }
          tabIndex={0}
          role="button"
        />
      </div>
    );
  }
}

export default Header;
