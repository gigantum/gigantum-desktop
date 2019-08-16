// @flow
import React, { Component } from 'react';
// constants
import {
  PROMPT,
  INSTALLING,
  INSTALLED
} from '../../containers/machine/InstallDockerConstants';
// assets
import './InstallDockerMain.scss';

type Props = {
  machine: {
    value: string
  }
};

const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';

const getOS = () => {
  let OS = isMac ? 'Mac' : '';
  OS = isWindows ? 'Windows' : OS;
  return OS;
};

export default class InstallDockerMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const OS = getOS();

    const installedText = `The Docker for ${OS} installer has been opened.`;

    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          To use Gigantum locally, please download & install Docker.
          <div className="InstallDockerMain__subtext">
            <p>
              Docker Desktop for Mac is available for <a>free</a>.{'\n'}
              Requires Apple Mac OS Sierra 10.12 or above.
            </p>

            <p>
              By downloading, you agree to the terms of the{' '}
              <a>Docker Software End User License Agreement</a> and the{' '}
              <a>Docker Data Processing Agreement.</a>
            </p>
            <p>Gigantum is not affiliated or endorsed by Docker.</p>
          </div>
        </div>
      ),
      [INSTALLING]: (
        <div className="Layout__Main">
          Please wait while the Docker installer is downloaded to your computer.
        </div>
      ),
      [INSTALLED]: (
        <div className="Layout__Main">
          <p>{installedText}</p>
          <p>Follow the steps shown to complete the install process.</p>
        </div>
      )
    };

    return renderMap[props.machine.value];
  }
}
