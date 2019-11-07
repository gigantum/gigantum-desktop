// @flow
import React, { Component } from 'react';
// assets
import './InstallCompleteMain.scss';

type Props = {};

const isWindows = process.platform === 'win32';

export default class InstallCompleteMain extends Component<Props> {
  props: Props;

  render() {
    const direction = isWindows ? 'bottom' : 'top';
    return (
      <div className="Layout__Main">
        <p>You are ready to use Gigantum.</p>
        <p>Click the Gigantum icon on the menu bar on the {direction} right.</p>
        <p>Press the Start button to launch the application.</p>
      </div>
    );
  }
}
