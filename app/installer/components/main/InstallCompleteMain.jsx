// @flow
import React, { Component } from 'react';
// assets
import './InstallCompleteMain.scss';

type Props = {};

export default class InstallCompleteMain extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        <p>You are ready to use Gigantum.</p>
        <p>Click the Gigantum icon on the menu bar on the top right.</p>
        <p>Press the Start button to launch the application.</p>
      </div>
    );
  }
}
