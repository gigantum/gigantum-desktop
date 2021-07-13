// @flow
import React, { Component } from 'react';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './InstallWSL2Status.scss';
// utils
import utils from '../../../libs/utilities';
// constants
import {
  PROMPT,
  KERNAL_PROMPT,
  INSTALLING,
  ERROR
} from '../machine/InstallWSL2Constants';

type Props = {
  denyKernal: () => void,
  installKernal: () => void,
  machine: {
    value: string
  },
  optOut: () => void,
  startInstall: () => void,
  storage: {
    get: () => void,
    set: () => void
  },
  messenger: () => void
};

const CheckWSL2Status = ({}) => {

  /**
    @param {}
    handles install button
  */
  handleInstallButton = () => {
    const { messenger, startInstall, storage } = this.props;
    storage.set('promptKernal', true);
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
  denyKernal = () => {
    const { props } = this;
    props.denyKernal();
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
    const kernalPrompted = props.storage.get('promptKernal');
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
            {!kernalPrompted && (
              <button
                type="button"
                className="Btn__Status"
                onClick={() => this.denyKernal()}
              >
                Opt-out of WSL2
              </button>
            )}
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
