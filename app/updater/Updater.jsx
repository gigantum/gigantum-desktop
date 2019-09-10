// @flow
import React, { Component } from 'react';
import { remote } from 'electron';
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

/**
  @param {object} response
  @param {object} state
  processes progress data
*/
const getProgress = (response, state) => {
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
  return progress;
};

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
    // subscribes to progress information
    this.messenger.checkDownloadProgress(this.progressCallback);
  };

  messenger = new UpdaterMessenger();

  interface = new UpdaterInterface({ messenger: this.messenger });

  /**
    @param {object} response
    handles response from updateGigantumImage
  */
  interfaceCallback = response => {
    const { state } = this;
    if (response.success) {
      const progress = getProgress(response, state);
      this.setState({ progress });
    }
    if (response.data.finished) {
      this.messenger.downloadComplete();
      setTimeout(() => {
        this.transition(SUCCESS, { message: 'Download Complete' });
      }, 3000);
    }
  };

  /**
    @param {object} response
    handles response from checkDownloadProgress
  */
  progressCallback = response => {
    const { state } = this;
    const totalDownload = response.newImageSize + response.total;
    const downloadedBytes = response.success
      ? state.totalAppSize || 0
      : response.transferred;
    this.setState({ progress: (downloadedBytes / totalDownload) * 100 });
    if (state.totalAppSize === null) {
      this.setState({ totalAppSize: response.total });
    }
    if (response.success) {
      this.interface.updateGigantumImage(this.interfaceCallback, response);
    }
  };

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
        {renderMap[state.machine.value]}
        <button
          className="Updater__close"
          type="button"
          onClick={() => this.messenger.closeUpdater()}
        />
      </div>
    );
  }
}
