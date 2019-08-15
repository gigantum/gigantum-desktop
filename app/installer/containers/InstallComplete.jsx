// @flow
import React, { Component } from 'react';
// containers
import Layout from './Layout';
// componenets
import InstallCompleteMain from '../components/main/InstallCompleteMain';
import InstallCompleteStatus from '../components/status/InstallCompleteStatus';
// assets
import './Container.scss';

export default class Checking extends Component<Props> {
  props: Props;

  render() {
    const { machine, message, messenger } = this.props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={4}
          main={<InstallCompleteMain />}
          status={<InstallCompleteStatus messenger={messenger} />}
        />
      </div>
    );
  }
}
