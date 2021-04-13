// @flow
import React, { Component } from 'react';
// States
import installWSL2Machine from './machine/InstallWSL2Machine';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
import { INSTALL } from './machine/InstallWSL2Constants';
// containers
import Layout from './Layout';
// libs
import wslStatus from '../../libs/wslStatus';
// componenets
import InstallWSL2Main from '../components/main/InstallWSL2Main';
import InstallWSL2Status from '../components/status/InstallWSL2Status';
// assets
import './Container.scss';

class InstallWSL2 extends Component<Props> {
  props: Props;

  state = {
    machine: installWSL2Machine.initialState,
    progress: 0,
    wslLookupComplete: false
  };

  componentDidMount = () => {
    const wslExistsCallback = () => {
      this.installWSL2Transition(SUCCESS);
      this.setState({ wslLookupComplete: true });
    };
    wslStatus(wslExistsCallback, wslExistsCallback, () =>
      this.setState({ wslLookupComplete: true })
    );
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
  installKernal = () => {
    const { props } = this;
    const installCallback = response => {
      if (response.success) {
        props.storage.set('wslConfigured', true);
        props.transition(SUCCESS, {
          message: 'Checking For Docker'
        });
      } else {
        props.transition(ERROR, {
          message: 'WSL2 Setup Failed'
        });
      }
    };

    this.installWSL2Transition(SUCCESS);

    props.interface.installKernal(installCallback);
  };

  /**
   * @param {}
   *  changes state when installing begins
   */
  optOut = () => {
    const { props } = this;
    props.transition(SUCCESS, {
      message: 'Checking For Docker'
    });
  };

  /**
   * @param {}
   *  changes state when installing begins
   */
  startInstall = () => {
    const { props } = this;

    const installErrorHandler = () => {
      props.transition(ERROR, {
        message: 'WSL2 Setup Failed'
      });
    };

    const callback = response => {
      if (response.success) {
        setTimeout(() => {
          this.installWSL2Transition(SUCCESS);
        }, 3000);
      } else {
        installErrorHandler();
      }
    };

    this.installWSL2Transition(INSTALL);

    props.interface.enableSubsystem(callback);
  };

  render() {
    const { state, props } = this;
    const { machine, message } = props;
    const { value } = machine;
    const { wslLookupComplete } = this.state;
    if (!wslLookupComplete) {
      return <div className="Spinner" />;
    }
    return (
      <div data-tid="container">
        <Layout
          currentState={value}
          section={machine.value}
          message={message}
          progress={1}
          main={<InstallWSL2Main machine={state.machine} />}
          status={
            <InstallWSL2Status
              startInstall={this.startInstall}
              installKernal={this.installKernal}
              optOut={this.optOut}
              machine={state.machine}
              progress={state.progress}
              storage={props.storage}
              messenger={props.messenger}
            />
          }
        />
      </div>
    );
  }
}

export default InstallWSL2;
