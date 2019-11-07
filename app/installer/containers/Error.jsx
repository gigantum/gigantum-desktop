// @flow
import React, { Component } from 'react';
// constants
import {
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM
} from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import ErrorMain from '../components/main/ErrorMain';
import ErrorStatus from '../components/status/ErrorStatus';
// assets
import './Container.scss';

export default class Checking extends Component<Props> {
  props: Props;

  render() {
    const { machine, message, metaData, transition } = this.props;
    let currentState = machine.value;
    let progress = 1;
    if (message === 'Docker Configuration Failed') {
      currentState = CONFIGURE_DOCKER;
      progress = 2;
    } else if (message === 'Gigantum Configuration Failed') {
      currentState = CONFIGURE_GIGANTUM;
      progress = 3;
    } else if (message === 'Docker Install Failed') {
      currentState = INSTALL_DOCKER;
    }

    return (
      <div data-tid="container">
        <Layout
          currentState={currentState}
          message={message}
          progress={progress}
          main={
            <ErrorMain
              metaData={metaData}
              message={message}
              transition={transition}
              currentState={currentState}
            />
          }
          status={
            <ErrorStatus
              metaData={metaData}
              message={message}
              transition={transition}
              currentState={currentState}
            />
          }
        />
      </div>
    );
  }
}
