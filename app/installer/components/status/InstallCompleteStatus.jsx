// @flow
import React, { Component } from 'react';
// assets
import './Status.scss';
import './InstallCompleteStatus.scss';
import InstallCompleteSrc from 'Images/logos/installComplete.png';

type Props = {
  messenger: {
    closeInstaller: () => void
  }
};

export default class InstallCompleteStatus extends Component<Props> {
  props: Props;

  render() {
    const { messenger } = this.props;
    return (
      <div className="Layout__Status InstallCompleteStatus">
        <img alt="docker" src={InstallCompleteSrc} width="250" height="208" />
        <button
          type="button"
          className="Btn--primary Btn__Status"
          onClick={() => messenger.closeInstaller()}
        >
          Close
        </button>
      </div>
    );
  }
}
