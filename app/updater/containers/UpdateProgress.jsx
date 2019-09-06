// @flow
import React, { Component } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// componenets
import Header from '../components/Header';
// assets
import './UpdateProgress.scss';

type Props = {
  progress: number,
  message: string
};

export default class UpdateProgress extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const { progress, message } = props;
    return (
      <div className="UpdateProgress">
        <Header message={message} />
        <div className="UpdateProgress__body">
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
          <div className="UpdateProgress__message">
            Downloading Gigantum Desktop
          </div>
        </div>
      </div>
    );
  }
}
