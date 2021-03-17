// @flow
import React, { Component, Fragment } from 'react';
import utils from '../../../libs/utilities';
// constants
import {
  PROMPT,
  INSTALLING,
  INSTALLED,
  LAUNCHING
} from '../../containers/machine/InstallDockerConstants';
// libs
import wslStatus from '../../../libs/wslStatus';
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

  state = {
    isWSL: null
  };

  componentDidMount() {
    if (isWindows) {
      wslStatus(
        () => this.setState({ isWSL: true }),
        () => this.setState({ isWSL: true }),
        () => this.setState({ isWSL: false })
      );
    }
  }

  render() {
    const { props } = this;
    const { isWSL } = this.state;
    const OS = getOS();
    const desktopText = isLinux ? '' : 'Desktop';
    let requirementVersion = '';
    requirementVersion = isMac
      ? 'Requires Apple Mac OS Sierra 10.12 or above.'
      : requirementVersion;

    const installingText = isLinux
      ? 'Please wait while Docker is being installed.\n\n This can take a few minutes'
      : 'Please wait while the Docker installer is downloaded to your computer.';

    let installedText = `The Docker Desktop installer volume has been opened.\n\n Drag and drop Docker into your Application folder to install Docker.`;

    installedText = isWindows
      ? `The Docker Desktop installer has been opened.\n\n Complete the installation process and then return to this screen. \n\n Do not check “Install required Windows components for WSL 2” as shown to the right.`
      : installedText;
    installedText = isWSL
      ? `The Docker Desktop installer has been opened.\n\n Complete the installation process and then return to this screen. \n\n Make sure to check “Install required Windows components for WSL 2” as shown to the right.`
      : installedText;

    const windowsPreText =
      'Docker Desktop for Windows is available for free and works with ';

    const windowsPostText = isWSL
      ? ' of Windows 10 (Version 1903 or higher, with Build 18362 or higher) when using WSL 2.'
      : 'Windows 10 Pro, Enterprise, or Education when using Hyper-V.';
    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          Install Docker to run Gigantum locally.
          <div className="InstallDockerMain__subtext">
            {!isWindows && (
              <p>
                Docker {desktopText} for {OS} is available for free.
                {'\n'}
                {requirementVersion}
              </p>
            )}
            {isWindows && isWSL !== null && (
              <p>
                {windowsPreText}
                {isWSL && (
                  <span
                    onClick={() =>
                      utils.open(
                        'https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-2---check-requirements-for-running-wsl-2'
                      )
                    }
                    role="presentation"
                  >
                    most versions
                  </span>
                )}
                {windowsPostText}
              </p>
            )}

            <p>
              By downloading, you agree to the terms of the{' '}
              <span
                onClick={() =>
                  utils.open(
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
                  utils.open(
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
      [LAUNCHING]: (
        <div className="Layout__Main">
          The Docker installer is launching. Please Wait.
          <div className="Layout__subtext">
            Note: This can take up to several minutes depending on your security
            software.
          </div>
        </div>
      ),
      [INSTALLED]: (
        <div className="Layout__Main">
          {!isLinux && installedText}
          {isLinux && (
            <Fragment>
              <p>
                To start using Docker you must <b>reboot your computer</b>.
              </p>
              <p>
                Once rebooted and logged in, open Gigantum to finish the
                installation process.
              </p>
            </Fragment>
          )}
        </div>
      )
    };

    return renderMap[props.machine.value];
  }
}
