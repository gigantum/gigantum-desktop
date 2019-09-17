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
    configured: false,
    progress: 0,
    currentProgress: 0,
    step: 0.001
  };

  componentDidMount = () => {
    const { message } = this.props;
    if (message === 'Configure Gigantum') {
      this.configureDocker(true);
    }
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
    @param {}
    handles progress bar
  */
  handleTimer = () => {
    const { state } = this;
    setTimeout(() => {
      if (state.configured) {
        this.setState({
          progress: 100,
          currentProgress: 0
        });
      } else {
        const newCurrentProgress = state.currentProgress + state.step;
        const progress = (
          Math.round(
            (Math.atan(newCurrentProgress) / (Math.PI / 2)) * 100 * 1000
          ) / 1000
        ).toFixed(2);
        this.setState({ progress, currentProgress: newCurrentProgress }, () => {
          this.handleTimer();
        });
      }
    }, 100);
  };

  /**
   * @param {Boolean} skipConfigure
   *  configures docker
   */
  configureDocker = skipConfigure => {
    this.handleTimer();
    const { props } = this;
    const action = skipConfigure ? LAUNCH : CONFIGURE;
    let configureRan = false;
    const callback = response => {
      if (response.success) {
        props.storage.set('dockerConfigured', true);
        this.setState({ configured: true });
        setTimeout(() => {
          if (!configureRan) {
            configureRan = true;
            props.transition(SUCCESS, {
              message: 'Configure Gigantum'
            });
          }
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
              progress={state.progress}
            />
          }
        />
      </div>
    );
  }
}
