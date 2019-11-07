// @flow
import React, { Component } from 'react';
import {
  PROMPT,
  LAUNCHING,
  CONFIGURING,
  RESTARTING,
  RESTART_PROMPT
} from '../../containers/machine/ConfigureDockerConstants';
// assets
import './ConfigureDockerMain.scss';

const isWindows = process.platform === 'win32';

type Props = {
  machine: {
    value: string
  }
};

export default class ConfigureDockerMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;

    const configuringPrimaryText = isWindows
      ? 'We are configuring Docker for you.'
      : 'We are configuring Docker for you and restarting the application.';
    const configuringSecondaryText = isWindows
      ? 'Please wait while Docker starts and the configuration is applied.'
      : 'Docker can take up to 10 minutes to restart.';

    const renderMap = {
      [LAUNCHING]: (
        <div className="Layout__Main">
          <p>We are starting Docker with existing settings.</p>
          <p>Docker can take up to 5 minutes to start.</p>
        </div>
      ),
      [CONFIGURING]: (
        <div className="Layout__Main">
          <p>{configuringPrimaryText}</p>
          <p>{configuringSecondaryText}</p>
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
      ),
      [RESTART_PROMPT]: (
        <div className="Layout__Main">
          <p>For changes to take effect you must restart Docker.</p>
          <p>Please manually restart Docker as shown to the right.</p>
          <p>The installer will proceed once a restart is detected.</p>
        </div>
      ),
      [RESTARTING]: (
        <div className="Layout__Main">
          <p>Please wait for Docker to restart.</p>
          <p>This can take up to 5 minutes.</p>
        </div>
      )
    };
    return renderMap[props.machine.value];
  }
}
