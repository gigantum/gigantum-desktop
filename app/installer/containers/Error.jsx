// @flow
import React, { Component } from 'react';
// constants
import {
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_WSL2
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
    } else if (message === 'WSL2 Setup Failed') {
      currentState = INSTALL_WSL2;
    }

    return (
      <div data-tid="container">
        <Layout
          currentState={currentState}
          message={message}
          progress={progress}
        >
          <ErrorMain
            metaData={metaData}
            message={message}
            transition={transition}
            currentState={currentState}
          />
          <ErrorStatus
            metaData={metaData}
            message={message}
            transition={transition}
            currentState={currentState}
          />
        </Layout>
      </div>
    );
  }
}
