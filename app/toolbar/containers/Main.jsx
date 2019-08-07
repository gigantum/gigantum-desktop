// @flow
// vendor
import React, { Component } from 'react';
// state
import stateMachine from '../machine/ToolbarMachine';
// components
import Status from '../components/status/Status';
import Header from '../components/common/Header';
import Buttons from '../components/common/Buttons';
// assets
import './Main.scss';

type Props = {};

export default class Main extends Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState,
    message: 'Checking for Docker'
  };

  componentDidMount() {
    setTimeout(() => {
      this.transition('STOPPED', { message: 'Click to Start' });
    }, 5000);
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
      category: nextState && nextState.category ? nextState.category : ''
      // installNeeded:
      //   nextState && nextState.installNeeded ? nextState.installNeeded : false
    });
  };

  render() {
    const { state } = this;

    return (
      <div data-tid="container">
        <Header machine={state.machine} />
        <Status
          machine={state.machine}
          message={state.message}
          transition={this.transition}
          category={state.category}
        />
        <Buttons machine={state.machine} transition={this.transition} />
      </div>
    );
  }
}
