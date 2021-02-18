// @flow
import React, { Component } from 'react';
// constants
import {
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_WSL2,
  INSTALL_DOCKER,
  ERROR,
  TRY_AGAIN_INSTALL_DOCKER,
  TRY_AGAIN_CONFIGURE_GIGANTUM,
  TRY_AGAIN_CONFIGURE_DOCKER,
  TRY_AGAIN_INSTALL_WSL
} from '../../machine/InstallerConstants';
// assets
import './Status.scss';
import './ErrorStatus.scss';

type Props = {
  transition: () => void,
  metaData: {
    spaceAvailable: number
  },
  message: string,
  currentState: string
};

export default class ErrorStatus extends Component<Props> {
  props: Props;

  /**
    @param {Array} params
    handles Try again button given errorMessage
  */
  tryAgain = params => {
    const { props } = this;
    props.transition(params[0], {
      message: params[1]
    });
  };

  render() {
    const { props } = this;
    const errorText =
      props.metaData &&
      `You only have ${props.metaData.spaceAvailable}GB of disk space available.`;

    const buttonParams = {
      [CONFIGURE_DOCKER]: [TRY_AGAIN_CONFIGURE_DOCKER, 'Configure Docker'],
      [CONFIGURE_GIGANTUM]: [
        TRY_AGAIN_CONFIGURE_GIGANTUM,
        'Configure Gigantum'
      ],
      [INSTALL_DOCKER]: [TRY_AGAIN_INSTALL_DOCKER, 'Install Docker'],
      [INSTALL_WSL2]: [TRY_AGAIN_INSTALL_WSL, 'Install WSL2'],
      [ERROR]: [TRY_AGAIN_INSTALL_DOCKER, 'Install Docker']
    };

    return (
      <div className="Layout__Status ErrorStatus">
        <div className="ErrorStatus__icon" />
        {props.message === 'Not Enough Disk Space' && (
          <div className="ErrorStatus__message">{errorText}</div>
        )}
        <button
          className="Btn__Status Btn--primary"
          type="button"
          onClick={() => this.tryAgain(buttonParams[props.currentState])}
        >
          Try Again
        </button>
      </div>
    );
  }
}
