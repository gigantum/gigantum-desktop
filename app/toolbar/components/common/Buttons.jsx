// @flow
import React, { PureComponent } from 'react';
import { shell } from 'electron';
// States
import {
  STOPPED,
  LOADING,
  STARTING,
  STOPPING,
  CONFIRM_ACTION,
  RESTART,
  FORCE_RESTART,
  ERROR,
  SUCCESS
} from '../../machine/ToolbarConstants';
// assets
import './Buttons.scss';

type Props = {
  machine: {
    value: ''
  },
  transition: () => void,
  storage: object
};

export default class Buttons extends PureComponent<Props> {
  props: Props;

  /**
    @param {}
    handles Gigantum restart
  */
  handleGigantumRestart = () => {
    const { props } = this;
    const { storage } = props;
    const validateRestart = !storage.get('restart.gigantumConfirm');

    if (validateRestart) {
      props.transition(RESTART, {
        message: 'Are you sure?',
        category: 'restart.gigantum'
      });
    } else {
      props.transition(FORCE_RESTART, {
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
    // TODO get this from a config
    const defaultUrl = 'http://localhost:10000/';

    return (
      <div data-tid="container" className="Buttons">
        <button
          className="Btn__Toolbar"
          disabled={disableButtons}
          type="button"
          onClick={() => shell.openExternal(defaultUrl)}
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
