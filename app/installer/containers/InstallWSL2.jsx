// @flow
import React, { Component } from 'react';
// States
import installWSL2Machine from './machine/InstallWSL2Machine';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
import { INSTALL } from './machine/InstallWSL2Constants';
// containers
import Layout from './Layout';
// componenets
import InstallWSL2Main from '../components/main/InstallWSL2Main';
import InstallWSL2Status from '../components/status/InstallWSL2Status';
// assets
import './Container.scss';

export default class InstallWSL2 extends Component<Props> {
  props: Props;

  state = {
    machine: installWSL2Machine.initialState,
    progress: 0
  };

  /**
    @param {string} eventType
    sets transition of the state machine
  */
  installWSL2Transition = eventType => {
    const { state } = this;

    const newState = installWSL2Machine.transition(
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
    this.installWSL2Transition(INSTALL);

    const installErrorHandler = () => {
      props.transition(ERROR, {
        message: 'Ubuntu Install Failed'
      });
    };

    const configureCallback = response => {
      if (response.success) {
        setTimeout(() => {
          props.transition(SUCCESS, {
            message: 'Checking For Docker'
          });
        }, 2500);
      } else {
        installErrorHandler();
      }
    };

    const launchCallback = response => {
      if (response.success) {
        setTimeout(() => {
          this.installWSL2Transition(SUCCESS);
        }, 3000);
      } else {
        installErrorHandler();
      }
    };

    const progressCallback = response => {
      if (response.success) {
        this.setState({ progress: response.progress });
        if (response.finished) {
          setTimeout(() => {
            this.installWSL2Transition(SUCCESS);
          }, 3000);
        }
      } else {
        installErrorHandler();
      }
    };

    props.interface.downloadLinux(
      progressCallback,
      launchCallback,
      configureCallback
    );
  };

  render() {
    const { state, props } = this;
    const { machine, message } = props;
    console.log('ran');
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={1}
          main={<InstallWSL2Main machine={state.machine} />}
          status={
            <InstallWSL2Status
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
