// @flow
import React, { Component } from 'react';
import open from 'open';

// constants
import {
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_DOCKER,
  ERROR
} from '../../machine/InstallerConstants';
// assets
import './ErrorMain.scss';

type Props = {
  currentState: string
};

const isWindows = process.platform === 'win32';

export default class ErrorMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;

    const confifgureDockerText = isWindows
      ? ' ensure Docker is configured to use Linux containers instead of Windows containers and restart the application'
      : ' restart the application.';

    const renderMap = {
      [CONFIGURE_DOCKER]: (
        <p className="Layout__Main">
          There was an error configuring Docker. Try restarting the application.
          If the issue persists visit our{' '}
          <span
            role="presentation"
            onClick={() => open('https://spectrum.chat/gigantum')}
          >
            Spectrum Chat
          </span>{' '}
          for support.
        </p>
      ),
      [CONFIGURE_GIGANTUM]: (
        <p className="Layout__Main">
          There was an error configuring Gigantum. Please try again. If the
          issue persists
          {confifgureDockerText}
        </p>
      ),
      [INSTALL_DOCKER]: (
        <p className="Layout__Main">
          There was an error installing docker. Please try again. If the issue
          persists restart the application.
        </p>
      ),
      [ERROR]: (
        <div className="Layout__Main">
          <p>
            To begin the configuration process you must have at least <b>8GB</b>{' '}
            of disk space
          </p>
          <p>
            This is required to make sure you have enough storage to start
            working.
          </p>
        </div>
      )
    };

    return renderMap[props.currentState];
  }
}
