// @flow
import React, { Component } from 'react';
// assets
import './Status.scss';
import './CheckDockerStatus.scss';

type Props = {};

export default class CheckDockerStatus extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Status CheckDockerStatus">
        <div className="CheckDockerStatus__spinner" />
        <div className="CheckDockerStatus__message">
          Checking for Docker installation
        </div>
      </div>
    );
  }
}
