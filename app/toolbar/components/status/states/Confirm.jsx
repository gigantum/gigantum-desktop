// @flow
import * as React from 'react';
// States
import {
  CANCEL,
  CONFIRM,
  REPROMPT,
  SUCCESS,
  ERROR
} from '../../../machine/ToolbarConstants';
// assets
import './Confirm.scss';

type Props = {
  message: string,
  category: string,
  transition: () => void
};

class Confirm extends React.Component<Props> {
  props: Props;

  /**
    @param {Boolean} confirm
    handles confirm sent to statemachine
  */
  stopGigantumState = () => {
    const { props } = this;
    props.transition(CONFIRM, {
      message: 'Stopping Gigantum'
    });
  };

  /**
    @param {Boolean} closeDocker
    handles Gigantum Close
  */
  handleGigantumClose = () => {
    const { props } = this;
    // closeDocker variable passed to async docker method
    setTimeout(() => {
      const error = false;
      if (error) {
        props.transition(ERROR, {
          message: 'response.error'
        });
      } else {
        props.transition(SUCCESS, {
          message: 'Click to Start'
        });
      }
    }, 5000);
  };

  /**
    @param {Boolean} confirm
    handleds confirm action buttons
  */
  confirmAction = confirm => {
    const { props } = this;
    const { category } = props;
    // TODO check config to see if setting is remembered
    const validateDockerClose = true;

    if (category === 'closeDocker') {
      this.stopGigantumState();
      this.handleGigantumClose(confirm);
    } else if (category === 'closeGigantum') {
      if (!confirm) {
        props.transition(CANCEL, {
          message: 'Click to Quit'
        });
      } else if (validateDockerClose) {
        props.transition(REPROMPT, {
          message: 'Would you like to close Docker?',
          category: 'closeDocker'
        });
      } else {
        const shouldCloseDockerConfig = true;
        this.stopGigantumState();
        this.handleGigantumClose(shouldCloseDockerConfig);
      }
    }
  };

  render() {
    const { props } = this;
    return (
      <div className="Confirm">
        <div className="Confirm__message">{props.message}</div>
        <div className="Confirm__container">
          <button
            type="button"
            className="Btn__Confirm Btn--primary"
            onClick={() => this.confirmAction(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className="Btn__Confirm"
            onClick={() => this.confirmAction(false)}
          >
            No
          </button>
        </div>
      </div>
    );
  }
}

export default Confirm;
