// @flow
import React, { Component } from 'react';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './Status.scss';
import './InstallWSL2Status.scss';
import utils from '../../../libs/utilities';
// constants
import {
  PROMPT,
  KERNAL_PROMPT,
  INSTALLING,
  ERROR
} from '../../containers/machine/InstallWSL2Constants';

type Props = {
  installKernal: () => void,
  machine: {
    value: string
  },
  optOut: () => void,
  startInstall: () => void,
  storage: {
    set: () => void
  }
};

class CheckWSL2Status extends Component<Props> {
  props: Props;

  /**
    @param {}
    handles install button
  */
  handleInstallButton = () => {
    const { props } = this;
    props.startInstall();
  };

  /**
    @param {}
    handles launch button
  */
  handleKernalButton = () => {
    const { props } = this;
    props.installKernal();
  };

  /**
    @param {}
    handles launch button
  */
  handleOptOutButton = () => {
    const { props } = this;
    props.storage.set('wslConfigured', true);
    props.optOut();
  };

  render() {
    const { props } = this;
    const progressMap = {
      NO_PROGRESS: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__noProgress" />
        </div>
      )
    };
    const renderMap = {
      [KERNAL_PROMPT]: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__body">
            <div className="InstallWSL2Status__subtext">
              Installing the Kernal will require admin privileges. Gigantum will
              ask for elevated privileges during the installation process.{' '}
              <span
                role="presentation"
                onClick={() =>
                  utils.open(
                    'https://docs.docker.com/install/linux/docker-ce/debian/#install-using-the-convenience-script'
                  )
                }
              >
                Learn More.
              </span>
            </div>
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => this.handleKernalButton()}
            >
              Install Kernal Update
            </button>
          </div>
        </div>
      ),
      [INSTALLING]: progressMap.NO_PROGRESS,
      [ERROR]: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__body">
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => this.handleLaunchButton()}
            >
              Try Again
            </button>
          </div>
        </div>
      ),
      [PROMPT]: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__body">
            <div className="InstallWSL2Status__subtext">
              Alternatively, you can opt-out of WSL. This is not recommended and
              will make Gigantum incompatible with some versions of Windows
              (i.e. Windows Home Edition).
            </div>
            <button
              type="button"
              className="Btn__Status"
              onClick={() => this.handleOptOutButton()}
            >
              Opt-out
            </button>
            <div className="InstallWSL2Status__subtext">
              Enabling WSL will require admin privileges. Gigantum will ask for
              elevated privileges during the installation process.{' '}
              <span
                role="presentation"
                onClick={() =>
                  utils.open(
                    'https://docs.docker.com/install/linux/docker-ce/debian/#install-using-the-convenience-script'
                  )
                }
              >
                Learn More.
              </span>
            </div>
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => this.handleInstallButton()}
            >
              Enable & Restart
            </button>
          </div>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}

export default CheckWSL2Status;
