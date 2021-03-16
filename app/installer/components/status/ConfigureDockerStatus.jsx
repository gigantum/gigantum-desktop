// @flow
import React, { Component } from 'react';
// assets
import dockerSrc from 'Images/logos/docker.png';
import installCompleteWindows from 'Images/logos/restart-docker-windows.gif';
import './Status.scss';
import './ConfigureDockerStatus.scss';
// components
import CircularProgress from '../progressbar/circular/CircularProgress';
// constants
import {
  PROMPT,
  LAUNCHING,
  RESTARTING,
  RESTART_PROMPT,
  CONFIGURING
} from '../../containers/machine/ConfigureDockerConstants';

type Props = {
  configureDocker: () => void,
  skipConfigure: boolean,
  machine: {
    value: string
  },
  progress: number
};

class ConfigureDockerStatus extends Component<Props> {
  props: Props;

  render() {
    const { configureDocker, machine, progress, skipConfigure } = this.props;
    const spinnerText = skipConfigure
      ? 'Starting Docker'
      : 'Configuring Docker';

    const renderMap = {
      [LAUNCHING]: <CircularProgress progress={progress} text={spinnerText} />,
      [CONFIGURING]: (
        <CircularProgress progress={progress} text={spinnerText} />
      ),
      [RESTARTING]: <CircularProgress progress={progress} text={spinnerText} />,
      [RESTART_PROMPT]: (
        <div className="Layout__Status flex flex--column justify--center align-items--center">
          <img
            src={installCompleteWindows}
            width="250"
            height="250"
            alt="restart"
          />
        </div>
      ),
      [PROMPT]: (
        <div className="Layout__Status ConfigureDockerStatus">
          <div className="ConfigureDockerStatus__body">
            <img alt="docker" src={dockerSrc} width="150" height="150" />
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => configureDocker(false)}
            >
              Configure
            </button>
            <button
              type="button"
              className="Btn__Status"
              onClick={() => configureDocker(true)}
            >
              I&aposll do it myself
            </button>
          </div>
        </div>
      )
    };
    return renderMap[machine.value];
  }
}

export default ConfigureDockerStatus;
