// @flow
import React, { Component } from 'react';
// constants
import {
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  ERROR
} from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import CheckDockerMain from '../components/main/CheckDockerMain';
import CheckDockerStatus from '../components/status/CheckDockerStatus';
// assets
import './Container.scss';

const isLinux = process.platform === 'linux';

export default class Checking extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { props } = this;
    const dockerConfigured = props.storage.get('dockerConfigured');
    console.log(dockerConfigured);
    const callback = response => {
      if (response.success) {
        if (dockerConfigured || isLinux) {
          props.transition(CONFIGURE_GIGANTUM, {
            message: 'Configure Gigantum'
          });
        } else {
          props.transition(CONFIGURE_DOCKER, { message: 'Configure Docker' });
        }
      } else {
        const { message } = response.data.error;
        if (message.indexOf('Not Enough Disk Space') > -1) {
          const { spaceAvailable } = response.data.error;
          props.transition(ERROR, {
            message: 'Not Enough Disk Space',
            metaData: { spaceAvailable }
          });
        } else {
          props.transition(INSTALL_DOCKER, { message: 'Install Docker' });
        }
      }
    };
    props.interface.check(callback);
  }

  render() {
    const { machine, message } = this.props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={1}
          main={<CheckDockerMain />}
          status={<CheckDockerStatus />}
        />
      </div>
    );
  }
}
