// @flow
import React, { Component } from 'react';
// componenets
import Header from '../components/Header';
import CircularProgress from '../../installer/components/progressbar/circular/CircularProgress';
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
          {progress === 0 && <div className="UpdateProgress__spinner" />}
          {progress > 0 && (
            <CircularProgress
              progress={progress}
              text={`${Math.floor(progress)}%`}
            />
          )}
          <div className="UpdateProgress__message">
            Downloading Gigantum Desktop
          </div>
        </div>
      </div>
    );
  }
}
