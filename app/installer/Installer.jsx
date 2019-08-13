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
// libs
import InstallerClass from '../libs/Installer';
// containers
import Checking from './containers/Checking';
// assets
import './Installer.scss';

type Props = {};

export default class Installer extends Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState
  };

  installer = new InstallerClass();

  triggerInstall = () => {
    const { installer } = this;

    const updateSettingsCallback = response => {
      console.log(response);
    };

    const checkIfDockerIsReadyCallback = response => {
      if (response.success) {
        installer.updateSettings(updateSettingsCallback);
      }
    };

    const checkForApplicationCallback = response => {
      console.log(response);
      if (response.success) {
        installer.checkIfDockerIsReady(checkIfDockerIsReadyCallback);
      }
    };

    const dndCallback = response => {
      console.log(response);
      if (response.success) {
        installer.checkForApplication(checkForApplicationCallback, 0);
      }
    };

    const downloadDockerCallback = response => {
      console.log(response);
      if (response.success) {
        installer.openDragAndDrop(response.data.downloadedFile, dndCallback);
      }
    };

    installer.downloadDocker(downloadDockerCallback);
  };

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
      [CHECKING]: <Checking {...props} {...state} transition={transition} />,
      [INSTALL_DOCKER]: (
        <Checking {...props} {...state} transition={transition} />
      ),
      [CONFIGURE_DOCKER]: (
        <Checking {...props} {...state} transition={transition} />
      ),
      [CONFIGURE_GIGANTUM]: (
        <Checking {...props} {...state} transition={transition} />
      ),
      [INSTALL_COMPLETE]: (
        <Checking {...props} {...state} transition={transition} />
      ),
      [ERROR]: <Checking {...props} {...state} transition={transition} />
    };

    return <div data-tid="container">{renderMap[state.machine.value]}</div>;
  }
}
