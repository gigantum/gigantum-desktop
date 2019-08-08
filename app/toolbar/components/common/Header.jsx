// @flow
import React, { PureComponent } from 'react';
// States
import {
  RUNNING,
  ERROR,
  STOPPED,
  LOADING,
  STARTING,
  STOPPING
} from '../../machine/ToolbarConstants';
// assets
import './Header.scss';

type Props = {
  machine: {
    value: ''
  }
};

export default class Header extends PureComponent<Props> {
  props: Props;

  render() {
    const { props } = this;
    const renderMap = {
      [STARTING]: <div>is starting</div>,
      [RUNNING]: <div>is running</div>,
      [STOPPED]: <div />,
      [STOPPING]: <div>is stopping</div>,
      [ERROR]: <div />,
      [LOADING]: <div />
    };

    return (
      <div data-tid="container" className="Header">
        <div className="Header__Logo" />
        {renderMap[props.machine.value]}
      </div>
    );
  }
}
