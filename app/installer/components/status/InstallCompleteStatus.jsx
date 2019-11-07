// @flow
import React, { Component } from 'react';
// assets
import './Status.scss';
import './InstallCompleteStatus.scss';
import InstallCompleteSrc from 'Images/logos/installComplete.png';
import InstallCompleteWindows from 'Images/logos/start-gigantum-windows.gif';

const isWindows = process.platform === 'win32';

type Props = {
  messenger: {
    closeInstaller: () => void
  }
};

export default class InstallCompleteStatus extends Component<Props> {
  props: Props;

  render() {
    const { messenger } = this.props;
    let imageSrc = InstallCompleteSrc;
    imageSrc = isWindows ? InstallCompleteWindows : imageSrc;
    let height = '208';
    height = isWindows ? '300' : height;
    return (
      <div className="Layout__Status InstallCompleteStatus">
        <img alt="docker" src={imageSrc} width="250" height={height} />
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
