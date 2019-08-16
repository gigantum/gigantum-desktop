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

type Props = {
  machine: {
    value: ''
  },
  storage: {
    get: () => void
  },
  messenger: {
    quitApp: () => void
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
      click: () => {}
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
      click: () => {}
    },
    {
      label: 'Open Log File',
      click: () => {}
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        const { props } = this;
        const { machine, storage, messenger } = props;
        const currentState = machine.value;
        if (currentState === RUNNING) {
          let validateGigantumClose = !storage.get('close.gigantumConfirm');
          const shouldCloseDockerConfig = storage.get('close.dockerConfirm');
          const validateDockerClose = shouldCloseDockerConfig === undefined;
          const stopCallback = () => {
            messenger.quitApp();
          };
          const checkRunningProjectsCallback = response => {
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
                message: 'Closing Gigantum'
              });
              props.interface.stop(stopCallback, shouldCloseDockerConfig);
            }
          };
          props.interface.checkRunningProjects(checkRunningProjectsCallback);
        } else {
          messenger.quitApp();
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
