// @flow
import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// assets
import LinuxSrc from 'Images/logos/linux.png';
import './Status.scss';
import './InstallWSL2Status.scss';
import utils from '../../../libs/utilities';
// constants
import {
  PROMPT,
  INSTALLING,
  INSTALLED,
  LAUNCHING
} from '../../containers/machine/InstallWSL2Constants';

type Props = {
  startInstall: () => void,
  progress: number,
  machine: {
    value: string
  }
};

export default class CheckWSL2Status extends Component<Props> {
  props: Props;

  /**
    @param {}
    handles install button
  */
  handleInstallButton = () => {
    const { props } = this;
    props.startInstall();
  };

  render() {
    const { props } = this;
    const { progress } = props;
    const progressKey = progress ? 'PROGRESS' : 'NO_PROGRESS';
    const spinnerMessage = 'Downloading Linux Image';
    const progressMap = {
      PROGRESS: (
        <div className="Layout__Status InstallDockerStatus">
          <div className="InstallWSL2Status__body">
            <CircularProgressbar
              value={progress}
              text={`${Math.floor(progress)}%`}
              styles={buildStyles({
                strokeLinecap: 'butt',
                textSize: '24px',
                textColor: '#9b9c9e',
                trailColor: '#e3e4e5',
                pathColor: '#386e80'
              })}
            />
            <div className="CheckWSL2Status__message">{spinnerMessage}</div>
          </div>
        </div>
      ),
      NO_PROGRESS: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__noProgress" />
        </div>
      )
    };
    const renderMap = {
      [INSTALLING]: progressMap[progressKey],
      [INSTALLED]: (
        <div className="Layout__Status flex justify--center align-items--center">
          <div className="InstallWSL2Status__image" />
        </div>
      ),
      [LAUNCHING]: progressMap.NO_PROGRESS,
      [PROMPT]: (
        <div className="Layout__Status InstallWSL2Status">
          <div className="InstallWSL2Status__body">
            <img alt="wsl2" src={LinuxSrc} width="150" height="150" />
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => this.handleInstallButton()}
            >
              Download & Install
            </button>
            <div className="InstallWSL2Status__subtext">
              This requires admin privileges. Gigantum will ask for elevated
              privileges during the installation process.{' '}
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
          </div>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}
