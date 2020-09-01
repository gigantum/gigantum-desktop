// @flow
import React, { Component } from 'react';
// constants
import {
  PROMPT,
  INSTALLING,
  INSTALLED,
  LAUNCHING
} from '../../containers/machine/InstallWSL2Constants';
// assets
import './InstallWSL2Main.scss';

type Props = {
  machine: {
    value: string
  }
};

export default class InstallWSL2Main extends Component<Props> {
  props: Props;

  render() {
    const { props } = this;

    const installingText =
      'Please wait while Ubuntu is being downloaded.\n\n This can take a few minutes';
    const installedText =
      'The Linux distrubution is now launching. \n\n Follow the steps in the console to complete the installation';

    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          Gigantum for Windows now runs on WSL2 (Windows Subsystem for Linux)
          <div className="InstallDockerMain__subtext">
            <p>
              This requires an downloading a compatable Linux distribution
              (Ubuntu). Gigantum will handle the configuration process.
            </p>

            <p>Gigantum is not affiliated or endorsed by Ubuntu.</p>
          </div>
        </div>
      ),
      [INSTALLING]: <div className="Layout__Main">{installingText}</div>,
      [LAUNCHING]: (
        <div className="Layout__Main">
          Gigantum is configuring the Windows subsystem automatically.
          <div className="Layout__subtext">
            Note: This can take up to several minutes depending on your security
            software.
          </div>
        </div>
      ),
      [INSTALLED]: <div className="Layout__Main">{installedText}</div>
    };

    return renderMap[props.machine.value];
  }
}
