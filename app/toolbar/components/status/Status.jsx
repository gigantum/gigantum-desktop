// @flow
import React, { Component } from 'react';
// States
import stateMachine, {
  LOADING,
  RUNNING,
  STOPPED,
  STARTING,
  STOPPING,
  ERROR
} from './machine/StatusMachine';
// Componenets
import Error from './states/Error';
import Running from './states/Running';
import Stopped from './states/Stopped';
import Transition from './states/Transition';
// assets
import './Status.scss';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState
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
    @param {object} extState
    sets transition of the state machine
  */
  transition = (eventType, extState) => {
    const { state } = this;
    const newState = stateMachine.transition(state.machine.value, eventType, {
      state
    });
    this.runActions(newState);
    this.setState({
      machine: newState,
      message: extState && extState.message ? extState.message : '',
      installNeeded:
        extState && extState.installNeeded ? extState.installNeeded : false
    });
  };

  render() {
    const { props, state } = this;

    const renderMap = {
      [STARTING]: (
        <Transition {...props} {...state} transition={this.transition} />
      ),
      [RUNNING]: <Running {...props} {...state} transition={this.transition} />,
      [STOPPED]: <Stopped {...props} {...state} transition={this.transition} />,
      [STOPPING]: <Error {...props} {...state} transition={this.transition} />,
      [ERROR]: <Error {...props} {...state} transition={this.transition} />,
      [LOADING]: (
        <Transition {...props} {...state} transition={this.transition} />
      )
    };
    if (state && state.machine) {
      return renderMap[state.machine.value];
    }
    return null;
  }
}
