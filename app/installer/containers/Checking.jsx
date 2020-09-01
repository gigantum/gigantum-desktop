// @flow
import React, { Component } from 'react';
// constants
import {
  INSTALL_DOCKER,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_WSL2,
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
    console.log('CHECKING MOUNTED');
    const { props } = this;
    const dockerConfigured = props.storage.get('dockerConfigured');
    const callback = response => {
      console.log(response);
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
        console.log(message);
        if (message && message.indexOf('Not Enough Disk Space') > -1) {
          const { spaceAvailable } = response.data.error;
          props.transition(ERROR, {
            message: 'Not Enough Disk Space',
            metaData: { spaceAvailable }
          });
        } else if (message && message.indexOf('WSL2 not configured.') > -1) {
          console.log('ran here.');
          props.transition(INSTALL_WSL2, {
            message: 'Configure Windows Subsystem'
          });
        } else {
          props.transition(INSTALL_DOCKER, { message: 'Install Docker' });
        }
      }
    };
    setTimeout(() => {
      props.interface.check(callback);
    }, 1000);
  }

  render() {
    const { machine, message } = this.props;
    console.log('state updated in checking');
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
