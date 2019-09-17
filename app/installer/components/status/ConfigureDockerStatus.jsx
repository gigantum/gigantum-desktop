// @flow
import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './Status.scss';
import './ConfigureDockerStatus.scss';
import DockerSrc from 'Images/logos/docker.png';
// constants
import {
  PROMPT,
  LAUNCHING,
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

export default class ConfigureDockerStatus extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const spinnerText = props.skipConfigure
      ? 'Starting Docker'
      : 'Configuring Docker';

    const ProgressBar = () => (
      <div className="Layout__Status InstallDockerStatus">
        <div className="InstallDockerStatus__body">
          <CircularProgressbar
            value={props.progress}
            text={`${Math.floor(props.progress)}%`}
            styles={buildStyles({
              strokeLinecap: 'butt',
              textSize: '24px',
              textColor: '#9b9c9e',
              trailColor: '#e3e4e5',
              pathColor: '#386e80'
            })}
          />
          <div className="CheckDockerStatus__message">{spinnerText}</div>
        </div>
      </div>
    );

    const renderMap = {
      [LAUNCHING]: <ProgressBar />,
      [CONFIGURING]: <ProgressBar />,
      [PROMPT]: (
        <div className="Layout__Status ConfigureDockerStatus">
          <div className="ConfigureDockerStatus__body">
            <img alt="docker" src={DockerSrc} width="150" height="150" />
            <button
              type="button"
              className="Btn__Status Btn--primary"
              onClick={() => props.configureDocker(false)}
            >
              Configure
            </button>
            <button
              type="button"
              className="Btn__Status"
              onClick={() => props.configureDocker(true)}
            >
              {"I'll do it myself"}
            </button>
          </div>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}
