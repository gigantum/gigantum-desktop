// @flow
import React, { Component, Fragment } from 'react';
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
    const desktopText = isLinux ? '' : 'Desktop';
    let requirementVersion = '';
    requirementVersion = isMac
      ? 'Requires Apple Mac OS Sierra 10.12 or above.'
      : requirementVersion;
    requirementVersion = isWindows
      ? 'Windows 10 64-bit: Pro, Enterprise, or Education.'
      : requirementVersion;

    const installingText = isLinux
      ? 'Please wait while Docker is being installed.\n\n This can take a few minutes'
      : 'Please wait while the Docker installer is downloaded to your computer.';

    let installedText = `The Docker Desktop installer volume has been opened.\n\n Drag and drop Docker into your Application folder to install Docker.`;

    installedText = isWindows
      ? `The Docker Desktop installer has been opened.\n\n Follow the instructions in the installer to install Docker.`
      : installedText;

    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          To use Gigantum locally, please download & install Docker.
          <div className="InstallDockerMain__subtext">
            <p>
              Docker {desktopText} for {OS} is available for free.
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
      [INSTALLED]: (
        <div className="Layout__Main">
          {!isLinux && installedText}
          {isLinux && (
            <Fragment>
              <p>
                To start using Docker you must <b>log out of your computer</b>{' '}
                and then log back in.
              </p>
              <p>
                Once logged in, open Gigantum to finish the installation
                process.
              </p>
            </Fragment>
          )}
        </div>
      )
    };

    return renderMap[props.machine.value];
  }
}
