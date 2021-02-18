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
  },
  messenger: () => void
};

class CheckWSL2Status extends Component<Props> {
  props: Props;

  /**
    @param {}
    handles install button
  */
  handleInstallButton = () => {
    const { messenger, startInstall } = this.props;
    messenger.setAutoLaunchOn();
    startInstall();
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
              Updating the kernel requires administrator privileges. You will be
              prompted to enter your password after clicking “Update Kernel”.{' '}
              <span
                role="presentation"
                onClick={() =>
                  utils.open(
                    'https://docs.microsoft.com/en-us/windows/wsl/install-win10'
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
              Update Kernel
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
              You can skip this step and use Hyper-V instead of WSL 2. If your
              system supports it, running Docker on WSL 2 is recommended over
              Hyper-V.
            </div>
            <button
              type="button"
              className="Btn__Status"
              onClick={() => this.handleOptOutButton()}
            >
              Install w/ Hyper-V
            </button>
            <div className="InstallWSL2Status__subtext">
              Enabling WSL 2 requires administrator privileges. You will be
              prompted to enter your password after clicking “Enable & Restart”.
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
