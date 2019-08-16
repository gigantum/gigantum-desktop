// @flow
import React, { Component } from 'react';
// States
import installDockerMachine from './machine/InstallDockerMachine';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
import { INSTALL } from './machine/InstallDockerConstants';
// containers
import Layout from './Layout';
// componenets
import InstallDockerMain from '../components/main/InstallDockerMain';
import InstallDockerStatus from '../components/status/InstallDockerStatus';
// assets
import './Container.scss';

export default class InstallDocker extends Component<Props> {
  props: Props;

  state = {
    machine: installDockerMachine.initialState,
    progress: 0
  };

  /**
    @param {string} eventType
    sets transition of the state machine
  */
  installDockerTransition = eventType => {
    const { state } = this;

    const newState = installDockerMachine.transition(
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
   * @param {}
   *  changes state when installing begins
   */
  startInstall = () => {
    const { props } = this;
    this.installDockerTransition(INSTALL);

    const installErrorHandler = () => {
      props.transition(ERROR, {
        message: 'Docker Install Failed'
      });
    };

    const dndCallback = response => {
      if (response.success) {
        props.transition(SUCCESS, {
          message: 'Configure Docker'
        });
      } else {
        installErrorHandler();
      }
    };

    const progressCallback = response => {
      if (response.success) {
        this.setState({ progress: response.progress });
      } else {
        installErrorHandler();
      }
    };

    props.interface.download(progressCallback, dndCallback);
  };

  render() {
    const { state, props } = this;
    const { machine, message } = props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={1}
          main={<InstallDockerMain machine={state.machine} />}
          status={
            <InstallDockerStatus
              startInstall={this.startInstall}
              machine={state.machine}
              progress={state.progress}
            />
          }
        />
      </div>
    );
  }
}
