// @flow
import React, { Component } from 'react';
// States
import {
  CHECKING,
  INSTALL_DOCKER,
  INSTALL_WSL2,
  CONFIGURE_DOCKER,
  CONFIGURE_GIGANTUM,
  INSTALL_COMPLETE,
  ERROR
} from './machine/InstallerConstants';
import stateMachine from './machine/InstallerMachine';
// docker
import InstallerInterface from '../libs/InstallerInterface';
// messenger
import InstallerMessenger from './messenger/InstallerMessenger';
// libs
import InstallerClass from '../libs/Installer';
// containers
import Checking from './containers/Checking';
import Error from './containers/Error';
import InstallWSL2 from './containers/InstallWSL2';
import InstallDocker from './containers/InstallDocker';
import ConfigureDocker from './containers/ConfigureDocker';
import ConfigureGigantum from './containers/ConfigureGigantum';
import InstallComplete from './containers/InstallComplete';
// assets
import './Installer.scss';

type Props = {
  storage: {
    get: () => void
  }
};

export default class Installer extends Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState,
    message: 'Checking for Docker'
  };

  messenger = new InstallerMessenger();

  installer = new InstallerClass();

  interface = new InstallerInterface();

  /**
    @param {object} state
    runs actions for the state machine on transition
  */
  runActions = state => {
    if (state.actions.length > 0) {
      state.actions.forEach(f => this[f]());
    }
  };

  /**
    @param {string} eventType
    @param {object} nextState
    sets transition of the state machine
  */
  transition = (eventType, nextState) => {
    const { state } = this;
    const newState = stateMachine.transition(state.machine.value, eventType, {
      state
    });

    this.runActions(newState);
    // TODO use category / installNeeded

    this.setState({
      machine: newState,
      message: nextState && nextState.message ? nextState.message : '',
      metaData: nextState && nextState.metaData ? nextState.metaData : ''
    });
  };

  /**
    @param {string} message
    overwrite header message
  */
  overwriteMessage = message => {
    this.setState({ message });
  };

  render() {
    const { props, state, transition } = this;
    const renderMap = {
      [CHECKING]: (
        <Checking
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
        />
      ),
      [INSTALL_DOCKER]: (
        <InstallDocker
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
        />
      ),
      [INSTALL_WSL2]: (
        <InstallWSL2
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
          messenger={this.messenger}
        />
      ),
      [CONFIGURE_DOCKER]: (
        <ConfigureDocker
          {...props}
          {...state}
          overwriteMessage={this.overwriteMessage}
          transition={transition}
          interface={this.interface}
        />
      ),
      [CONFIGURE_GIGANTUM]: (
        <ConfigureGigantum
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
        />
      ),
      [INSTALL_COMPLETE]: (
        <InstallComplete
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
          messenger={this.messenger}
        />
      ),
      [ERROR]: (
        <Error
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
        />
      )
    };

    return <div className="Installer">{renderMap[state.machine.value]}</div>;
  }
}
