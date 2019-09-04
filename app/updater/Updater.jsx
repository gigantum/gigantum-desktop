// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
import log from 'electron-log';
// States
import {
  UPDATE_AVAILABLE,
  UPDATE_IN_PROGRESS,
  DOWNLOAD_COMPLETE,
  SUCCESS
} from './machine/UpdaterConstants';
import stateMachine from './machine/UpdaterMachine';
// interface
import UpdaterInterface from '../libs/UpdaterInterface';
// messenger
import UpdaterMessenger from './messenger/UpdaterMessenger';
// containers
import UpdateAvailable from './containers/UpdateAvailable';
import DownloadComplete from './containers/DownloadComplete';
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
    // handles interface response
    const interfaceCallback = response => {
      const { state } = this;
      log.warn(response);
      if (response.success) {
        const imageSize = Number(
          state.changeLog
            .split('\n')[2]
            .split(': ')[1]
            .split(' ')[1]
            .slice(1, -5)
        );
        const rawPercentage = response.data.percentage / 100;
        const appSize = state.totalAppSize || 0;
        const totalDownload = appSize + imageSize;
        const totalDownloaded = imageSize * rawPercentage + appSize;
        const progress = (totalDownloaded / totalDownload) * 100;
        this.setState({ progress });
      }
      if (response.data.finished) {
        this.messenger.downloadComplete();
        setTimeout(() => {
          this.transition(SUCCESS, { message: 'Download Complete' });
        }, 3000);
      }
    };

    // handles response from updater event listeners
    const progressCallback = response => {
      const { state } = this;
      const totalDownload = response.newImageSize + response.total;
      log.warn(response);
      const downloadedBytes = response.success
        ? state.totalAppSize || 0
        : response.transferred;
      this.setState({ progress: (downloadedBytes / totalDownload) * 100 });
      if (state.totalAppSize === null) {
        this.setState({ totalAppSize: response.total });
      }
      if (response.success) {
        this.interface.updateGigantumImage(interfaceCallback, response);
      }
    };

    // subscribes to progress information
    this.messenger.checkDownloadProgress(progressCallback);
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
        <DownloadComplete
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
