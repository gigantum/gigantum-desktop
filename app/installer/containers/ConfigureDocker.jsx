// @flow
import React, { Component } from 'react';
// States
import configureDockerMachine from './machine/ConfigureDockerMachine';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
import { CONFIGURE, LAUNCH } from './machine/ConfigureDockerConstants';
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
    machine: configureDockerMachine.initialState,
    skipConfigure: false,
    configured: false
  };

  /**
    @param {string} eventType
    sets transition of the state machine
  */
  configureDockerTransition = eventType => {
    const { state } = this;

    const newState = configureDockerMachine.transition(
      state.machine.value,
      eventType,
      {
        state
      }
    );
    this.setState({
      machine: newState
    });
  };

  /**
   * @param {Boolean} skipConfigure
   *  configures docker
   */
  configureDocker = skipConfigure => {
    const { props } = this;
    const action = skipConfigure ? LAUNCH : CONFIGURE;
    const callback = response => {
      if (response.success) {
        props.storage.set('dockerConfigured', true);
        this.setState({ configured: true });
        setTimeout(() => {
          props.transition(SUCCESS, {
            message: 'Configure Gigantum'
          });
        }, 3000);
      } else {
        props.transition(ERROR, {
          message: 'Docker Configuration Failed'
        });
      }
    };

    this.setState({ skipConfigure });
    this.configureDockerTransition(action);
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
              machine={state.machine}
              skipConfigure={state.skipConfigure}
            />
          }
          status={
            <ConfigureDockerStatus
              machine={state.machine}
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
