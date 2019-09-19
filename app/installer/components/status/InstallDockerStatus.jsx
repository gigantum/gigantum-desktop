// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './Status.scss';
import './InstallDockerStatus.scss';
import DockerSrc from 'Images/logos/docker.png';
// constants
import {
  PROMPT,
  INSTALLING,
  INSTALLED
} from '../../containers/machine/InstallDockerConstants';

const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';

type Props = {
  startInstall: () => void,
  progress: number,
  machine: {
    value: string
  }
};

export default class CheckDockerStatus extends Component<Props> {
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
    const imageCSS = classNames({
      InstallDockerStatus__image: true,
      'InstallDockerStatus__image--linux': isLinux,
      'InstallDockerStatus__image--windows': isWindows,
      'InstallDockerStatus__image--mac': isMac
    });
    const progressMap = {
      PROGRESS: (
        <div className="Layout__Status InstallDockerStatus">
          <div className="InstallDockerStatus__body">
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
            <div className="CheckDockerStatus__message">
              Downloading Docker Installer
            </div>
          </div>
        </div>
      ),
      NO_PROGRESS: (
        <div className="Layout__Status InstallDockerStatus">
          <div className="InstallDockerStatus__noProgress">
            Installing Docker
          </div>
        </div>
      )
    };
    const renderMap = {
      [INSTALLING]: progressMap[progressKey],
      [INSTALLED]: (
        <div className="Layout__Status flex justify--center align-items--center">
          <div className={imageCSS} />
        </div>
      ),
      [PROMPT]: (
        <div className="Layout__Status InstallDockerStatus">
          <div className="InstallDockerStatus__body">
            <img alt="docker" src={DockerSrc} width="150" height="150" />
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => this.handleInstallButton()}
            >
              Download & Install
            </button>
          </div>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}
