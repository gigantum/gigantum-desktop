// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
// States
import {
  UPDATE_AVAILABLE,
  UPDATE_IN_PROGRESS,
  DOWNLOAD_COMPLETE
} from './machine/UpdaterConstants';
import stateMachine from './machine/UpdaterMachine';
// interface
import UpdaterInterface from '../libs/UpdaterInterface';
// messenger
import UpdaterMessenger from './messenger/UpdaterMessenger';
// containers
import UpdateAvailable from './containers/UpdateAvailable';
import UpdateProgress from './containers/UpdateProgress';
// assets
import './Updater.scss';

type Props = {};

export default class Updater extends Component<Props> {
  props: Props;

  state = {
    changeLog: remote.getCurrentWindow().changeLog.releaseNotes,
    machine: stateMachine.initialState,
    message: 'Update Available',
    progress: 0,
    appDownloaded: false,
    totalAppSize: null
  };

  componentDidMount = () => {
    const callback = response => {
      const { state } = this;
      const totalDownload = response.newImageSize + response.total;
      const downloadedBytes = response.success
        ? response.total
        : response.transferred;
      this.setState({ progress: downloadedBytes / totalDownload });
      if (!state.totalAppSize) {
        this.setState({ totalAppSize: response.total });
      }
    };
    this.messenger.checkDownloadProgress(callback);
  };

  messenger = new UpdaterMessenger();

  interface = new UpdaterInterface({ messenger: this.messenger });

  /**
    @param {string} eventType
    @param {object} nextState
    sets transition of the state machine
  */
  transition = (eventType, nextState) => {
    const { state } = this;

    const newState = stateMachine.transition(state.machine.value, eventType, {
      state
    });

    this.setState({
      machine: newState,
      message: nextState && nextState.message ? nextState.message : ''
    });
  };

  render() {
    const { props, state, transition, messenger } = this;
    const renderMap = {
      [UPDATE_AVAILABLE]: (
        <UpdateAvailable
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
          messenger={messenger}
        />
      ),
      [UPDATE_IN_PROGRESS]: (
        <UpdateProgress
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
        />
      ),
      [DOWNLOAD_COMPLETE]: (
        <div
          {...props}
          {...state}
          transition={transition}
          interface={this.interface}
          messenger={messenger}
        />
      )
    };

    return (
      <div className="Updater">
        <button
          className="Updater__close"
          type="button"
          onClick={() => this.messenger.closeUpdater()}
        />
        {renderMap[state.machine.value]}
      </div>
    );
  }
}
