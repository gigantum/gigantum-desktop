// @flow
import React, { Component } from 'react';
import {
  PROMPT,
  LAUNCHING,
  CONFIGURING
} from '../../containers/machine/ConfigureDockerConstants';
// assets
import './ConfigureDockerMain.scss';

type Props = {
  machine: {
    value: string
  }
};

export default class ConfigureDockerMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;

    const renderMap = {
      [LAUNCHING]: (
        <div className="Layout__Main">
          <p>We are starting Docker with existing settings.</p>
          <p>Docker can take up to 5 minutes to start.</p>
        </div>
      ),
      [CONFIGURING]: (
        <div className="Layout__Main">
          <p>
            We are configuring Docker for you and restarting the application.
          </p>
          <p>Docker can take up to 10 minutes to restart.</p>
        </div>
      ),
      [PROMPT]: (
        <div className="Layout__Main">
          <p>
            For optimal use with Gigantum, Docker requires some additional
            configuration.
          </p>
          <p>Click “Configure” to automatically set up Docker.</p>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}
