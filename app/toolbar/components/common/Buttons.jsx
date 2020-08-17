// @flow
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { remote } from 'electron';
import utils from '../../../libs/utilities';
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
  },
  messenger: {
    checkUpdatesResponse: () => void,
    checkUpdates: () => void,
    showManageServer: () => void
  }
};

export default class Buttons extends PureComponent<Props> {
  props: Props;

  state = {
    updateAvailable: null,
    checkingUpdate: false
  };

  componentDidMount = () => {
    const { props } = this;
    const callback = response => {
      this.setState({ updateAvailable: response, checkingUpdate: false });
    };
    // sets event listener
    props.messenger.checkUpdatesResponse(callback);
    // checks initially on mount
    remote.getCurrentWindow().checkForUpdates();
  };

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

  /**
    @param {}
    handles check for udpate
  */
  checkForUpdate = () => {
    const { props, state } = this;
    props.messenger.checkUpdates();
    if (state.updateAvailable === null) {
      this.setState({ checkingUpdate: true });
    }
    this.setState({ disableUpdateButton: true });
    setTimeout(() => {
      this.setState({ disableUpdateButton: false });
    }, 10000);
  };

  /**
    @param {}
    gets update button text
  */
  getUpdateText = () => {
    const { state } = this;
    if (state.checkingUpdate) {
      return 'Checking for Updates';
    }
    if (state.updateAvailable === null) {
      return 'Check for Updates';
    }
    if (state.updateAvailable) {
      return 'Update Available';
    }
    return 'Up To Date';
  };

  /**
   * @param {} -
   * opens manager server window
   */
  manageServers = () => {
    const { messenger } = this.props;
    messenger.showManageServer();
  };

  render() {
    const { props, state } = this;
    const disableButtons =
      [STOPPING, LOADING, STOPPED, STARTING, CONFIRM_ACTION, ERROR].indexOf(
        props.machine.value
      ) > -1;
    const updateText = this.getUpdateText();
    // TODO get this from a config
    const defaultUrl = 'http://localhost:10000/';
    const disableUpdatebutton =
      state.updateAvailable === false || state.disableUpdateButton;

    const updateButtonCSS = classNames({
      Btn__Toolbar: true,
      'Btn__Toolbar--checking': state.checkingUpdate,
      'Btn__Toolbar--available': state.updateAvailable
    });

    return (
      <div data-tid="container" className="Buttons">
        <div className="Buttons__Actions">
          <button
            className="Btn__Toolbar Btn--external"
            disabled={disableButtons}
            type="button"
            onClick={() => utils.open(defaultUrl)}
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
          <button
            className={updateButtonCSS}
            type="button"
            onClick={() => this.checkForUpdate()}
            disabled={disableUpdatebutton}
          >
            {updateText}
          </button>
          <button
            className="Btn__Toolbar"
            type="button"
            onClick={() => this.manageServers()}
          >
            Manage Servers
          </button>
        </div>
        <div className="Buttons__Links">
          <button
            onClick={() => utils.open('https://spectrum.chat/gigantum/')}
            className="Btn__Link"
            type="button"
          >
            Help
          </button>
          <button
            onClick={() => utils.open('https://docs.gigantum.com/')}
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
