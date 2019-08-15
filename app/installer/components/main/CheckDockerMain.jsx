// @flow
import React, { Component } from 'react';
// assets
import './CheckDockerMain.scss';

type Props = {};

export default class CheckDocker extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        Work created in Gigantum is portable between computers because
        everything runs in a Docker Container
      </div>
    );
  }
}
