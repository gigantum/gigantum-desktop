// @flow
import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './Status.scss';
import './ConfigureDockerStatus.scss';
import DockerSrc from 'Images/logos/docker.png';

type Props = {
  configured: boolean,
  configureDocker: () => void,
  skipConfigure: boolean,
  configuring: boolean
};

export default class ConfigureDocker extends Component<Props> {
  props: Props;

  state = {
    progress: 0,
    currentProgress: 0,
    step: 0.001
  };

  /**
    @param {}
    handles progress bar
  */
  handleTimer = () => {
    const { state, props } = this;
    setTimeout(() => {
      if (props.configured) {
        this.setState({
          progress: 100,
          currentProgress: 0
        });
      } else {
        const newCurrentProgress = state.currentProgress + state.step;
        const progress = (
          Math.round(
            (Math.atan(newCurrentProgress) / (Math.PI / 2)) * 100 * 1000
          ) / 1000
        ).toFixed(2);
        this.setState({ progress, currentProgress: newCurrentProgress }, () => {
          this.handleTimer();
        });
      }
    }, 100);
  };

  /**
    @param {Boolean} skipConfigure
    handles install button
  */
  handleConfigureButton = skipConfigure => {
    const { props } = this;
    props.configureDocker(skipConfigure);
    this.handleTimer();
  };

  render() {
    const { props, state } = this;
    const { progress } = state;
    const spinnerText = props.skipConfigure
      ? 'Starting Docker'
      : 'Configuring Docker';
    if (props.configuring) {
      return (
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
            <div className="CheckDockerStatus__message">{spinnerText}</div>
          </div>
        </div>
      );
    }
    return (
      <div className="Layout__Status ConfigureDockerStatus">
        <div className="ConfigureDockerStatus__body">
          <img alt="docker" src={DockerSrc} width="150" height="150" />
          <button
            type="button"
            className="Btn__Status Btn--primary"
            onClick={() => this.handleConfigureButton(false)}
          >
            Configure
          </button>
          <button
            type="button"
            className="Btn__Status"
            onClick={() => this.handleConfigureButton(true)}
          >
            {"I'll do it myself"}
          </button>
        </div>
      </div>
    );
  }
}
