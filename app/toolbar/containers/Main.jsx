// @flow
// vendor
import React, { Component } from 'react';
// state
import stateMachine from '../machine/ToolbarMachine';
import { STOPPED, ERROR, RUNNING } from '../machine/ToolbarConstants';
// components
import Status from '../components/status/Status';
import Header from '../components/common/Header';
import Buttons from '../components/common/Buttons';
// assets
import './Main.scss';

type Props = {
  storage: object,
  interface: {
    check: () => void
  },
  messenger: {}
};

export default class Main extends Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState,
    message: 'Checking for Docker'
  };

  componentDidMount() {
    const { props } = this;
    const gigantumRunningCallback = response => {
      if (response.success) {
        this.transition(RUNNING, { message: 'Click to Stop' });
      }
    };
    const dockerExistsCallback = response => {
      if (response.success) {
        this.transition(STOPPED, { message: 'Click to Start' });
      } else {
        this.transition(ERROR, { message: 'Docker is not installed' });
      }
    };
    props.interface.check(dockerExistsCallback, gigantumRunningCallback);
  }

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
      category: nextState && nextState.category ? nextState.category : '',
      quittingApp: (nextState && nextState.quittingApp) || false
    });
  };

  render() {
    const { state, props } = this;
    console.log(props.storage);
    return (
      <div data-tid="container">
        <Header
          machine={state.machine}
          storage={props.storage}
          interface={props.interface}
          transition={this.transition}
          messenger={props.messenger}
        />
        <Status
          machine={state.machine}
          message={state.message}
          transition={this.transition}
          category={state.category}
          quittingApp={state.quittingApp}
          storage={props.storage}
          interface={props.interface}
          messenger={props.messenger}
        />
        <Buttons
          machine={state.machine}
          transition={this.transition}
          storage={props.storage}
          messenger={props.messenger}
        />
      </div>
    );
  }
}
