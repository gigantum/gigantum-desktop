// @flow
import React, { PureComponent } from 'react';
import open from 'open';
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
  storage: object,
  interface: {
    restart: () => void
  }
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
      const callback = response => {
        if (response.success) {
          props.transition(SUCCESS, {
            message: 'Click to Stop'
          });
        } else {
          props.transition(ERROR, {
            message: 'Gigantum failed to start'
          });
        }
      };
      props.interface.restart(callback);
    }
  };

  render() {
    const { props } = this;
    const disableButtons =
      [STOPPING, LOADING, STOPPED, STARTING, CONFIRM_ACTION, ERROR].indexOf(
        props.machine.value
      ) > -1;
    // TODO get this from a config
    const defaultUrl = 'http://localhost:10000/';

    return (
      <div data-tid="container" className="Buttons">
        <div className="Buttons__Actions">
          <button
            className="Btn__Toolbar Btn--external"
            disabled={disableButtons}
            type="button"
            onClick={() => open(defaultUrl)}
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
        <div className="Buttons__Links">
          <button
            onClick={() => open('https://spectrum.chat/gigantum/')}
            className="Btn__Link"
            type="button"
          >
            Help
          </button>
          <button
            onClick={() => open('https://docs.gigantum.com/')}
            className="Btn__Link"
            type="button"
          >
            Docs
          </button>
        </div>
      </div>
    );
  }
}
