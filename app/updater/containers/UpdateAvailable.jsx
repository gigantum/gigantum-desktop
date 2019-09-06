// @flow
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
// constants
import { CONFIRM } from '../machine/UpdaterConstants';
// componenets
import Header from '../components/Header';
// assets
import './UpdateAvailable.scss';

export default class UpdateAvailable extends Component<Props> {
  props: Props;

  /**
    @param {} -
    sets transition of the state machine
  */
  confirm = () => {
    const { props } = this;
    props.messenger.downloadUpdate();
    props.transition(CONFIRM, { message: 'Update In Progress' });
  };

  render() {
    const { props } = this;
    const { message, messenger, changeLog } = props;

    return (
      <div className="UpdateAvailable">
        <Header message={message} />
        <div className="UpdateAvailable__body">
          <div className="UpdateAvailable__subText">
            <div>Click “Download Update” to download the update. </div>
            <div>
              You can continue to work until the download is complete and you
              choose to restart
            </div>
            <p>
              Note: Docker must be running to update Gigantum. The update
              process will handle starting Docker for you.
            </p>
          </div>
          <div className="UpdateAvailable__releaseNotes">
            <div className="UpdateAvailable__noteHeader">Release Notes</div>
            <ReactMarkdown source={changeLog} escapeHtml={false} />
          </div>
          <div className="UpdateAvailable__buttons">
            <button
              type="button"
              className="Btn__Updater"
              onClick={() => messenger.closeUpdater()}
            >
              Remind Me Later
            </button>
            <button
              type="button"
              className="Btn__Updater Btn--primary Btn--last"
              onClick={() => this.confirm()}
            >
              Download Update
            </button>
          </div>
        </div>
      </div>
    );
  }
}
