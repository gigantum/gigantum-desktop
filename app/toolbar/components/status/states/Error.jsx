// @flow
import * as React from 'react';
import utils from '../../../../libs/utilities';
// State
import {
  SUCCESS,
  TRY_AGAIN,
  TRY_AGAIN_STOPPED,
  ERROR
} from '../../../machine/ToolbarConstants';
// assets
import './Error.scss';

const isWindows = process.platform === 'win32';

type Props = {
  transition: () => void,
  interface: {
    start: () => void,
    checkForDockerInstall: () => void,
    checkForGigantumInstall: () => void,
    restartDocker: () => void
  },
  message: '',
  messenger: {
    showInstaller: () => void
  }
};

/**
  @param {String} message
  gives appropriate subtext
*/
const getSubText = message => {
  switch (message) {
    case 'Gigantum is not configured':
      return {
        subText: (
          <div className="Error__subText">
            Gigantum Client runs in a Docker container that must be configured
          </div>
        ),
        buttonText: 'Configure Gigantum'
      };
    case 'Docker is not installed':
      return {
        subText: (
          <div className="Error__subText">
            {`Gigantum runs on Docker. \n To work locally you must install Docker`}
          </div>
        ),
        buttonText: 'Install Docker'
      };
    case 'Gigantum failed to start':
      return {
        subText: (
          <div className="Error__subText">
            Restarting Docker often resolves most issues. If this problem
            persists, reboot your computer or{' '}
            <a
              onKeyDown={() => utils.open('https://docs.gigantum.com/')}
              onClick={() => utils.open('https://docs.gigantum.com/')}
              tabIndex={0}
              role="button"
            >
              get help.
            </a>
          </div>
        ),
        buttonText: isWindows ? 'Try Again' : 'Restart Docker'
      };
    case 'Gigantum could not start':
      return {
        subText: (
          <div className="Error__subText">
            Port 10000 is in use and preventing Gigantum from starting. Free
            this port and then try starting again.
          </div>
        ),
        buttonText: 'Try Again'
      };
    default:
      return '';
  }
};

class Error extends React.Component<Props> {
  props: Props;

  componentDidMount = () => {
    const { props } = this;
    const { message, transition } = props;
    const callback = response => {
      if (response.success) {
        transition(TRY_AGAIN_STOPPED, { message: 'Click to Start' });
      }
    };

    // listens to see when docker is installed
    if (message === 'Docker is not installed') {
      props.interface.checkForDockerInstall(callback);
    } else if (message === 'Gigantum is not configured') {
      // listens to see when gigantum is installed
      props.interface.checkForGigantumInstall(callback);
    }
  };

  /**
    @param {String} buttonText
    handles button action from error screen
  */
  handleAction = buttonText => {
    const { props } = this;
    const handleErrorTransition = message => {
      props.transition(ERROR, { message });
    };
    const callback = response => {
      const errorMessage = response.error && response.error.message;
      if (response.success) {
        props.transition(SUCCESS, { message: 'Click to Quit' });
      } else if (errorMessage.indexOf('no such image') > -1) {
        handleErrorTransition('Gigantum is not configured');
      } else if (errorMessage.indexOf('port is already allocated') > -1) {
        handleErrorTransition('Gigantum could not start');
      } else {
        handleErrorTransition('Gigantum failed to start');
      }
    };

    if (buttonText === 'Try Again') {
      props.transition(TRY_AGAIN, {
        message: 'Starting Gigantum'
      });
      props.interface.start(callback);
    } else if (
      buttonText === 'Install Docker' ||
      buttonText === 'Configure Gigantum'
    ) {
      props.messenger.showInstaller();
    } else if (buttonText === 'Restart Docker') {
      props.transition(TRY_AGAIN, {
        message: 'Restarting Docker and Gigantum'
      });
      props.interface.restartDocker(callback);
    }
  };

  render() {
    const { props } = this;
    const { subText, buttonText } = getSubText(props.message);

    return (
      <div className="Error">
        <div className="Error__message">{props.message}</div>
        {subText}
        <button
          className="Btn__Error"
          onClick={() => this.handleAction(buttonText)}
          type="button"
        >
          {buttonText}
        </button>
      </div>
    );
  }
}

export default Error;
