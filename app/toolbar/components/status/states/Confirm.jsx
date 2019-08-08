// @flow
import * as React from 'react';
// States
import {
  CANCEL,
  CONFIRM,
  REPROMPT,
  SUCCESS,
  ERROR,
  CONFIRM_RESTART
} from '../../../machine/ToolbarConstants';
// assets
import './Confirm.scss';

type Props = {
  message: string,
  category: string,
  transition: () => void,
  storage: object
};

class Confirm extends React.Component<Props> {
  props: Props;

  state = {
    isChecked: false
  };

  /**
    @param {Boolean} isChecked
    handles checkbox and storage
  */
  handleCheckbox = isChecked => {
    const { props } = this;
    const { category, storage } = props;
    if (category !== 'close.docker') {
      storage.set(`${category}Confirm`, isChecked);
    }
    this.setState({ isChecked });
  };

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
    @param {}
    handles Gigantum restart
  */
  handleGigantumRestart = () => {
    const { props } = this;
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
  };

  /**
    @param {Boolean} confirm
    handleds confirm action buttons
  */
  confirmAction = confirm => {
    const { props, state } = this;
    const { category, storage } = props;
    // TODO check config to see if setting is remembered
    const shouldCloseDockerConfig = storage.get('close.dockerConfirm');
    const validateDockerClose = shouldCloseDockerConfig === undefined;

    if (category === 'close.docker') {
      this.stopGigantumState();
      this.handleGigantumClose(confirm);
      if (state.isChecked) {
        storage.set(`${category}Confirm`, confirm);
      }
    } else if (category === 'close.gigantum') {
      if (!confirm) {
        props.transition(CANCEL, {
          message: 'Click to Quit'
        });
      } else if (validateDockerClose) {
        this.setState(
          {
            isChecked: false
          },
          () => {
            console.log('this ran');
            console.log(this.state);
            props.transition(REPROMPT, {
              message: 'Would you like to close Docker?',
              category: 'close.docker'
            });
          }
        );
      } else {
        this.stopGigantumState();
        this.handleGigantumClose(shouldCloseDockerConfig);
      }
    } else if (category === 'restart.gigantum') {
      if (!confirm) {
        props.transition(CANCEL, {
          message: 'Click to Quit'
        });
      } else {
        this.handleGigantumRestart();
      }
    }
  };

  render() {
    const { props, state } = this;
    const { category } = props;
    const checkboxText =
      category === 'close.docker'
        ? 'Remember my selection next time'
        : "Don't ask me this again";
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
        <div className="Confirm__checkbox-Container">
          <label htmlFor="confirmAction" className="Confirm__checkbox">
            <input
              id="confirmAction"
              type="checkbox"
              checked={state.isChecked}
              onChange={evt => this.handleCheckbox(evt.target.checked)}
            />
            <span>{checkboxText}</span>
          </label>
        </div>
      </div>
    );
  }
}

export default Confirm;
