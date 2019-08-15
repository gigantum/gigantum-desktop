// @flow
import React, { Component } from 'react';
// assets
import './ConfigureDockerMain.scss';

type Props = {
  configuring: boolean,
  skipConfigure: () => void
};

export default class ConfigureDocker extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    if (props.configuring && props.skipConfigure) {
      return (
        <div className="Layout__Main">
          We are starting Docker with existing settings.
          <br />
          <br />
          Docker can take up to 5 minutes to start.
        </div>
      );
    }
    if (props.configuring) {
      return (
        <div className="Layout__Main">
          We are configuring Docker for you and restarting the application.
          <br />
          <br />
          Docker can take up to 10 minutes to restart.
        </div>
      );
    }
    return (
      <div className="Layout__Main">
        For optimal use with Gigantum, Docker requires some additional
        configuration.
        <br />
        <br />
        Click “Configure” to automatically set up Docker.
      </div>
    );
  }
}
