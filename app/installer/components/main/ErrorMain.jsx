// @flow
import React, { Component } from 'react';
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

export default class ErrorMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;

    const renderMap = {
      [CONFIGURE_DOCKER]: (
        <p>
          There was an error configuring Docker. Please try again. If the issue
          persists restart the application.
        </p>
      ),
      [CONFIGURE_GIGANTUM]: (
        <p>
          There was an error configuring Gigantum. Please try again. If the
          issue persists restart the application.
        </p>
      ),
      [INSTALL_DOCKER]: (
        <p>
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
