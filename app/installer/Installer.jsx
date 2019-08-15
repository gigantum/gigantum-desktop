// @flow
import React, { Component } from 'react';
// States
import {
  CHECKING,
  INSTALL_DOCKER,
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

  componentDidMount() {
    const { props } = this;
    const callback = response => {
      if (response.success) {
        if (props.storage.get('dockerConfigured')) {
          this.transition(CONFIGURE_GIGANTUM, {
            message: 'Configure Gigantum'
          });
        }
        this.transition(CONFIGURE_DOCKER, { message: 'Configure Docker' });
      } else {
        this.transition(INSTALL_DOCKER, { message: 'Install Docker' });
      }
    };
    this.interface.check(callback);
  }

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
      category: nextState && nextState.category ? nextState.category : ''
      // installNeeded:
      //   nextState && nextState.installNeeded ? nextState.installNeeded : false
    });
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
      [CONFIGURE_DOCKER]: (
        <ConfigureDocker
          {...props}
          {...state}
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
        <Checking
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
