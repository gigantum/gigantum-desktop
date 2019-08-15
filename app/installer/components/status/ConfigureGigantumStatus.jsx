// @flow
import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// assets
import './Status.scss';
import './ConfigureGigantumStatus.scss';

type Props = {
  configureGigantum: () => void,
  progress: number
};

export default class ConfigureDocker extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    const { props } = this;
    props.configureGigantum();
  };

  render() {
    const { props } = this;
    const { progress } = props;
    return (
      <div className="Layout__Status ConfigureGigantumStatus">
        <div className="ConfigureGigantumStatus__body">
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
          <div className="CheckGigantumStatus__message">
            Configuring Gigantum
          </div>
        </div>
      </div>
    );
  }
}
