// @flow
import React, { Component } from 'react';
// libs
import InstallerClass from '../libs/Installer';
// assets
import './Installer.scss';

type Props = {};

export default class Installer extends Component<Props> {
  props: Props;

  installer = new InstallerClass();

  triggerInstall = () => {
    const { installer } = this;

    const updateSettingsCallback = response => {
      console.log(response);
    };

    const checkIfDockerIsReadyCallback = response => {
      if (response.success) {
        installer.updateSettings(updateSettingsCallback);
      }
    };

    const checkForApplicationCallback = response => {
      console.log(response);
      if (response.success) {
        installer.checkIfDockerIsReady(checkIfDockerIsReadyCallback);
      }
    };

    const dndCallback = response => {
      console.log(response);
      if (response.success) {
        installer.checkForApplication(checkForApplicationCallback, 0);
      }
    };

    const downloadDockerCallback = response => {
      console.log(response);
      if (response.success) {
        installer.openDragAndDrop(response.data.downloadedFile, dndCallback);
      }
    };

    installer.downloadDocker(downloadDockerCallback);
  };

  render() {
    return (
      <div data-tid="container">
        <button
          className="Btn"
          type="button"
          onClick={() => {
            this.triggerInstall();
          }}
        >
          Install
        </button>
      </div>
    );
  }
}
