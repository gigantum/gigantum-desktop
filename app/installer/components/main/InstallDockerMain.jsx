// @flow
import React, { Component } from 'react';
// assets
import './InstallDockerMain.scss';

type Props = {
  installing: boolean,
  installed: boolean
};

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

export default class InstallDockerMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    let OS = isMac ? 'Mac' : '';
    OS = isWindows ? 'Windows' : OS;

    const installedText = `The Docker for ${OS} installer has been opened.`;

    if (props.installing) {
      return (
        <div className="Layout__Main">
          Please wait while the Docker installer is downloaded to your computer.
        </div>
      );
    }
    if (props.installed) {
      return (
        <div className="Layout__Main">
          {installedText}
          <br />
          <br />
          Follow the steps shown to complete the install process.
        </div>
      );
    }
    return (
      <div className="Layout__Main">
        To use Gigantum locally, please download & install Docker.
        <div className="InstallDockerMain__subtext">
          Docker Desktop for Mac is available for <a>free</a>
          .
          <br />
          Requires Apple Mac OS Sierra 10.12 or above.
          <br />
          <br />
          By downloading, you agree to the terms of the{' '}
          <a>Docker Software End User License Agreement</a> and the{' '}
          <a>Docker Data Processing Agreement.</a>
          <br />
          <br />
          Gigantum is not affiliated or endorsed by Docker.
        </div>
      </div>
    );
  }
}
