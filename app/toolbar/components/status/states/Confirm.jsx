// @flow
import * as React from 'react';
import open from 'open';
// States
import {
  CANCEL,
  CONFIRM,
  REPROMPT,
  SUCCESS,
  SHOW_WARNING,
  CONFIRM_WARNING,
  ERROR,
  CONFIRM_RESTART
} from '../../../machine/ToolbarConstants';
// assets
import './Confirm.scss';

const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';
const removeWarning = isLinux || isWindows;

type Props = {
  message: string,
  category: string,
  transition: () => void,
  storage: object,
  interface: {
    stop: () => void,
    restart: () => void
  },
  quittingApp: boolean,
  messenger: {
    quitApp: () => void,
    showToolbar: () => void
  }
};

class Confirm extends React.Component<Props> {
  props: Props;

  state = {
    isChecked: false
  };

  componentDidMount = () => {
    const { props } = this;
    if (props.quittingApp) {
      props.messenger.showToolbar();
    }
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
  handleGigantumClose = closeDocker => {
    const { props } = this;
    const hideWarning = props.storage.get('hide.dockerWarning');
    const callback = response => {
      if (props.quittingApp) {
        props.messenger.quitApp(props.interface);
      } else if (response.success) {
        if (isWindows && !hideWarning) {
          props.transition(SHOW_WARNING, {
            message:
              'Remember, Docker is still running. It is now safe to quit Docker.',
            category: 'warn.docker'
          });
        } else {
          props.transition(SUCCESS, {
            message: 'Click to Start'
          });
        }
      } else {
        props.transition(ERROR, {
          message: 'response.error'
        });
      }
    };
    props.interface.stop(callback, closeDocker);
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
  };

  /**
    @param {Boolean} confirm
    handleds confirm action buttons
  */
  confirmAction = confirm => {
    const { props, state } = this;
    const { category, storage, quittingApp } = props;
    // TODO check config to see if setting is remembered
    const shouldCloseDockerConfig = removeWarning
      ? false
      : storage.get('close.dockerConfirm');
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
            props.transition(REPROMPT, {
              message: 'Would you like to close Docker?',
              category: 'close.docker',
              quittingApp
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
    } else if (category === 'warn.docker') {
      console.log('confirm', confirm);
      console.log(state.isChecked, 'isChecked');
      if (state.isChecked) {
        console.log('ran storage set');
        storage.set('hide.dockerWarning', true);
      }
      if (!confirm) {
        open('https://docs.gigantum.com/');
      } else {
        props.transition(CONFIRM_WARNING, {
          message: 'Click to Start'
        });
      }
    }
  };

  render() {
    const { props, state } = this;
    const { category } = props;
    let checkboxText =
      category === 'close.docker'
        ? 'Remember my selection next time'
        : "Don't ask me this again";
    checkboxText =
      category === 'warn.docker' ? "Don't remind me again" : checkboxText;

    const primaryText = category === 'warn.docker' ? 'Got it' : 'Yes';
    const secondaryText = category === 'warn.docker' ? 'Show me how' : 'No';
    return (
      <div className="Confirm">
        <div className="Confirm__message">{props.message}</div>
        <div className="Confirm__container">
          <button
            type="button"
            className="Btn__Confirm Btn--primary"
            onClick={() => this.confirmAction(true)}
          >
            {primaryText}
          </button>
          <button
            type="button"
            className="Btn__Confirm"
            onClick={() => this.confirmAction(false)}
          >
            {secondaryText}
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
