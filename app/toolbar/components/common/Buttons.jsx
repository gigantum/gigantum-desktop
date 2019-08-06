// @flow
import React, { PureComponent } from 'react';
// States
import {
  STOPPED,
  LOADING,
  STARTING,
  STOPPING,
  CONFIRM_ACTION
} from '../../machine/ToolbarConstants';
// assets
import './Buttons.scss';

type Props = {
  machine: {
    value: ''
  }
};

export default class Buttons extends PureComponent<Props> {
  props: Props;

  render() {
    const { props } = this;
    const disableButtons =
      [STOPPING, LOADING, STOPPED, STARTING, CONFIRM_ACTION].indexOf(
        props.machine.value
      ) > -1;

    return (
      <div data-tid="container" className="Buttons">
        <button
          className="Btn__Toolbar"
          disabled={disableButtons}
          type="button"
        >
          Open in Window
        </button>
        <button
          className="Btn__Toolbar Btn--noBorder"
          disabled={disableButtons}
          type="button"
        >
          Restart
        </button>
        <button className="Btn__Toolbar" type="button">
          Check for Updates
        </button>
      </div>
    );
  }
}
