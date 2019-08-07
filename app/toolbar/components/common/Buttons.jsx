// @flow
import React, { PureComponent } from 'react';
// States
import {
  STOPPED,
  LOADING,
  STARTING,
  STOPPING,
  CONFIRM_ACTION,
  CONFIRM_RESTART,
  ERROR,
  SUCCESS
} from '../../machine/ToolbarConstants';
// assets
import './Buttons.scss';

type Props = {
  machine: {
    value: ''
  },
  transition: () => void
};

export default class Buttons extends PureComponent<Props> {
  props: Props;

  /**
    @param {}
    handles Gigantum restart
  */
  handleGigantumRestart = () => {
    const { props } = this;
    const validateRestart = true;

    if (validateRestart) {
      props.transition(CONFIRM_ACTION, {
        message: 'Are you sure?',
        category: 'restartGigantum'
      });
    } else {
      props.transition(CONFIRM_RESTART, {
        message: 'Restarting Gigantum'
      });
      // call restartGigantum
      setTimeout(() => {
        const error = false;
        if (error) {
          props.transition(ERROR, {
            message: 'response.error'
          });
        } else {
          props.transition(SUCCESS, {
            message: 'Click to Stop'
          });
        }
      }, 5000);
    }
  };

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
          Open in Browser
        </button>
        <button
          className="Btn__Toolbar Btn--noBorder"
          disabled={disableButtons}
          onClick={() => this.handleGigantumRestart()}
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
