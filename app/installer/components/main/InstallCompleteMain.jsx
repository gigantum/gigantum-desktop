// @flow
import React, { Component } from 'react';
// assets
import './InstallCompleteMain.scss';

type Props = {};

export default class InstallComplete extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        You are ready to use Gigantum.
        <br />
        <br />
        Click the Gigantum icon on the menu bar on the top right.
        <br />
        <br />
        Press the Start button to launch the application.
      </div>
    );
  }
}
