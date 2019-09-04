// @flow
import React, { Component } from 'react';
// componenets
import Header from '../components/Header';
// assets
import './DownloadComplete.scss';

export default class DownloadComplete extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const { message } = props;

    return (
      <div className="DownloadComplete">
        <Header message={message} />
        <div className="DownloadComplete__body">
          <div className="DownloadComplete__subText">
            <p>
              The update has been successfully downloaded.
              {'\n'}
              Click “Restart Now” to apply the update.
            </p>
            <p>
              Note: Be sure to save your work! The Client and all Project
              containers will be closed during the update process.
            </p>
          </div>
          <div className="DownloadComplete__buttons">
            <button
              type="button"
              className="Btn__Updater"
              onClick={() => props.messenger.closeUpdater()}
            >
              I’ll Restart Later
            </button>
            <button
              type="button"
              className="Btn__Updater Btn--primary Btn--last"
              onClick={() => props.messenger.quitAndInstall(props.interface)}
            >
              Restart Now
            </button>
          </div>
        </div>
      </div>
    );
  }
}
