// @flow
import React, { Component } from 'react';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import ConfigureDockerMain from '../components/main/ConfigureDockerMain';
import ConfigureDockerStatus from '../components/status/ConfigureDockerStatus';
// assets
import './Container.scss';

export default class ConfigureDocker extends Component<Props> {
  props: Props;

  state = {
    configuring: false,
    skipConfigure: false,
    configured: false
  };

  /**
   * @param {Boolean} skipConfigure
   *  configures docker
   */
  configureDocker = skipConfigure => {
    const { props } = this;
    this.setState({ configuring: true, skipConfigure });
    const callback = response => {
      console.log(response);
      if (response.success) {
        this.setState({ configured: true });
        setTimeout(() => {
          props.transition(SUCCESS, {
            message: 'Configure Gigantum'
          });
          this.setState({ configuring: false });
        }, 3000);
      } else {
        props.transition(ERROR, {
          message: 'Docker Install Failed'
        });
      }
    };
    props.interface.configureDocker(callback, skipConfigure);
  };

  render() {
    const { props, state } = this;
    const { machine, message } = props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={2}
          main={
            <ConfigureDockerMain
              configuring={state.configuring}
              skipConfigure={state.skipConfigure}
            />
          }
          status={
            <ConfigureDockerStatus
              configuring={state.configuring}
              configured={state.configured}
              configureDocker={this.configureDocker}
              skipConfigure={state.skipConfigure}
            />
          }
        />
      </div>
    );
  }
}
