// @flow
import React, { Component } from 'react';
// constants
import { CHECKING } from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import CheckDockerMain from '../components/main/CheckDockerMain';
import CheckDockerStatus from '../components/status/CheckDockerStatus';
// assets
import './Container.scss';

export default class Container extends Component<Props> {
  props: Props;

  render() {
    return (
      <div data-tid="container">
        <Layout
          currentState={CHECKING}
          main={CheckDockerMain}
          status={CheckDockerStatus}
        />
      </div>
    );
  }
}
