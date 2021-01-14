// @flow
import React, { Component } from 'react';
// constants
import {
  PROMPT,
  KERNAL_PROMPT,
  INSTALLING,
  ERROR
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

    const renderMap = {
      [PROMPT]: (
        <div className="Layout__Main">
          Gigantum for Windows now runs on WSL2 (Windows Subsystem for Linux)
          <div className="InstallDockerMain__subtext">
            <p>
              WSL will significantly improve performance when using Gigantum and
              allows compatability with versions of Windows that do not have
              Hyper-V enabled.
            </p>

            <p>Enabling WSL will require a system restart. </p>
          </div>
        </div>
      ),
      [KERNAL_PROMPT]: (
        <div className="Layout__Main">
          WSL2 has been enabled. The final step for configuring WSL2 is to
          download an update to the Linux kernal. This action will not require a
          system restart.
        </div>
      ),
      [INSTALLING]: (
        <div className="Layout__Main">
          Gigantum is configuring the Windows subsystem automatically.
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

    return renderMap[props.machine.value];
  }
}
