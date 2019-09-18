// @flow
import React, { Component } from 'react';
import open from 'open';
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
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';

const getOS = () => {
  let OS = isMac ? 'Mac' : '';
  OS = isWindows ? 'Windows' : OS;
  OS = isLinux ? 'Linux ' : OS;
  return OS;
};

export default class InstallDockerMain extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;
    const OS = getOS();
    let requirementVersion = '';
    requirementVersion = isMac
      ? 'Requires Apple Mac OS Sierra 10.12 or above.'
      : requirementVersion;
    requirementVersion = isWindows
      ? 'Windows 10 64-bit: Pro, Enterprise, or Education.'
      : requirementVersion;

    const installingText = isLinux
      ? 'Please wait while Docker is being installed into your computer.'
      : 'Please wait while the Docker installer is downloaded to your computer.';

    let installedText = `The Docker Desktop installer volume has been opened.\n Drag and drop Docker into your Application folder to install Docker.`;

    installedText = isWindows
      ? `The Docker Desktop installer has been opened.\n Follow the instructions in the installer to install Docker.`
      : installedText;
    installedText = isLinux
      ? `Docker has been succesfully installed. \n Docker requires a log out of the current user to become usable.\nPlease relog and launch Gigantum to finish the installation`
      : installedText;

    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          To use Gigantum locally, please download & install Docker.
          <div className="InstallDockerMain__subtext">
            <p>
              Docker Desktop for {OS} is available for free.
              {'\n'}
              {requirementVersion}
            </p>

            <p>
              By downloading, you agree to the terms of the{' '}
              <span
                onClick={() =>
                  open(
                    'https://www.docker.com/legal/docker-software-end-user-license-agreement'
                  )
                }
                role="presentation"
              >
                Docker Software End User License Agreement
              </span>{' '}
              and the{' '}
              <span
                onClick={() =>
                  open(
                    'https://www.docker.com/sites/default/files/d8/2018-11/Docker-Data-Processing-Agreement-2018-06-08_0.pdf'
                  )
                }
                role="presentation"
              >
                Docker Data Processing Agreement.
              </span>
            </p>
            <p>Gigantum is not affiliated or endorsed by Docker.</p>
          </div>
        </div>
      ),
      [INSTALLING]: <div className="Layout__Main">{installingText}</div>,
      [INSTALLED]: <div className="Layout__Main">{installedText}</div>
    };

    return renderMap[props.machine.value];
  }
}
