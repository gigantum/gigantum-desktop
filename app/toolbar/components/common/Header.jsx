// @flow
import React, { PureComponent } from 'react';
import { remote } from 'electron';
import open from 'open';
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
} from '../../machine/ToolbarConstants';
// assets
import './Header.scss';

const { Menu } = remote;

const isLinux = process.platform === 'linux';

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
    showPreferences: () => void
  },
  interface: {
    stop: () => void,
    checkRunningProjects: () => void
  },
  transition: () => void
};

export default class Header extends PureComponent<Props> {
  props: Props;

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
        open('https://feedback.gigantum.com');
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
      click: () => {
        const { props } = this;
        const { machine, storage, messenger } = props;
        const currentState = machine.value;
        const stopCallback = () => {
          messenger.quitApp(props.interface);
        };
        const checkRunningProjectsCallback = response => {
          let validateGigantumClose = !storage.get('close.gigantumConfirm');
          const shouldCloseDockerConfig = isLinux
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

        if (currentState === RUNNING) {
          props.interface.checkRunningProjects(checkRunningProjectsCallback);
        } else {
          stopCallback();
        }
      }
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
