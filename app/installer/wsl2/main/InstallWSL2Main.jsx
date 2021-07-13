// @flow
import React from 'react';
// constants
import {
  PROMPT,
  KERNAL_PROMPT,
  INSTALLING,
  ERROR
} from '../machine/InstallWSL2Constants';
// assets
import utils from '../../../libs/utilities';
import './InstallWSL2Main.scss';

type Props = {
  machineValue: string
};

const InstallWSL2Main = ({ machineValue }: Props) => {

  const renderMap = {
    [PROMPT]: (
      <div className="Layout__Main">
        Gigantum can run on WSL 2 (Windows Subsystem for Linux 2)
        <div className="InstallDockerMain__subtext">
          <p>
            Using WSL 2 to run Docker, instead of the legacy Hyper-V based
            approach, can significantly improve performance. WSL 2 lets
            Gigantum run with fewer resources and on{' '}
            <span
              role="presentation"
              onClick={() =>
                utils.open(
                  'https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-2---check-requirements-for-running-wsl-2'
                )
              }
            >
              more versions of Windows as well.
            </span>
          </p>
          <p>
            Enabling WSL2 will restart your computer. On boot Gigantum Desktop
            will re-open to continue the installation process.
          </p>
        </div>
      </div>
    ),
    [KERNAL_PROMPT]: (
      <div className="Layout__Main">
        <p>WSL 2 is enabled on this machine.</p>
        <p>
          In order to use WSL 2 with Gigantum the Linux kernel must be
          updated.
        </p>
      </div>
    ),
    [INSTALLING]: (
      <div className="Layout__Main">
        Gigantum is updating your Linux kernel and configuring WSL 2.
        <div className="Layout__subtext">
          Note: This can take up to several minutes depending on your security
          software.
        </div>
      </div>
    ),
    [ERROR]: (
      <div className="Layout__Main">
        There was an error configuring WSL2. Please restart and try again.
      </div>
    )
  };

  return renderMap[machineValue];
}

export default InstallWSL2Main;
