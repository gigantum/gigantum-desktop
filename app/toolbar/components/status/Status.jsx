// @flow
import React, { Component } from 'react';
// States
import {
  RUNNING,
  ERROR,
  STOPPED,
  LOADING,
  CONFIRM_ACTION,
  STARTING,
  STOPPING
} from '../../machine/ToolbarConstants';
// Componenets
import Error from './states/Error';
import Running from './states/Running';
import Stopped from './states/Stopped';
import Transition from './states/Transition';
import Confirm from './states/Confirm';
// assets
import './Status.scss';

type Props = {
  machine: {
    value: ''
  }
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { props, state } = this;

    const renderMap = {
      [STARTING]: <Transition {...props} {...state} />,
      [RUNNING]: <Running {...props} {...state} />,
      [STOPPED]: <Stopped {...props} {...state} />,
      [STOPPING]: <Error {...props} {...state} />,
      [ERROR]: <Error {...props} {...state} />,
      [LOADING]: <Transition {...props} {...state} />,
      [CONFIRM_ACTION]: <Confirm {...props} {...state} />
    };
    if (props && props.machine) {
      return <div className="Status">{renderMap[props.machine.value]}</div>;
    }
    return null;
  }
}
