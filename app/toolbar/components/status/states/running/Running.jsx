// @flow
import * as React from 'react';
// State
import {
  PROMPT,
  FORCE_STOP,
  ERROR,
  SUCCESS,
  UNEXPECTED_STOP,
  SHOW_WARNING
} from '../../../../machine/ToolbarConstants';
// assets
import './Running.scss';

const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';
const removeWarning = isLinux || isWindows;

type Props = {
  transition: () => void,
  message: string,
  storage: object,
  messenger: {
    showToolbar: () => void
  },
  interface: {
    stop: () => void,
    listenToDockerEvents: () => void,
    checkRunningProjects: () => void
  }
};

class Running extends React.Component<Props> {
  props: Props;

  componentDidMount = () => {
    const { props } = this;
    this.mounted = true;
    const callback = response => {
      if (!response.success && this.mounted) {
        props.transition(UNEXPECTED_STOP, {
          message: 'Click to Start'
        });
      }
    };
    props.interface.listenToDockerEvents(callback);
  };

  componentWillUnmount = () => {
    this.mounted = false;
  };

  /**
    @param {Boolean} closeDocker
    handles Gigantum Close
  */
  handleGigantumClose = closeDocker => {
    const { props } = this;
    const wslConfigured = props.storage.get('wslConfigured');
    const hideWarning =
      props.storage.get('hide.dockerWarning') || wslConfigured;
    const callback = response => {
      if (response.success) {
        if (isWindows && !hideWarning) {
          props.messenger.showToolbar();
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
          message: 'Gigantum Failed to Stop'
        });
      }
    };
    props.interface.stop(callback, closeDocker);
  };

  confirmClose = () => {
    const { props } = this;
    const { storage } = props;
    props.transition(FORCE_STOP, {
      message: 'Stopping Gigantum'
    });
    let validateGigantumClose = !storage.get('close.gigantumConfirm');
    const shouldCloseDockerConfig = removeWarning
      ? false
      : storage.get('close.dockerConfirm');
    const validateDockerClose = shouldCloseDockerConfig === undefined;
    const checkRunningProjectsCallback = response => {
      if (response.success) {
        validateGigantumClose = false;
      }
      // resume confirmation checking
      if (validateGigantumClose) {
        props.transition(PROMPT, {
          message: 'Are you sure?',
          category: 'close.gigantum'
        });
      } else if (validateDockerClose) {
        props.transition(PROMPT, {
          message: 'Would you like to close Docker?',
          category: 'close.docker'
        });
      } else {
        this.handleGigantumClose(shouldCloseDockerConfig);
      }
    };
    props.interface.checkRunningProjects(checkRunningProjectsCallback);
  };

  render() {
    const { props } = this;
    return (
      <div className="Running">
        <div className="Running__message">{props.message}</div>
        <button
          type="button"
          className="Btn__Stop"
          onClick={this.confirmClose}
        />
      </div>
    );
  }
}

export default Running;
