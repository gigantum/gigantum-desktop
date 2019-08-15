// @flow
import React, { Component } from 'react';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import InstallDockerMain from '../components/main/InstallDockerMain';
import InstallDockerStatus from '../components/status/InstallDockerStatus';
// assets
import './Container.scss';

export default class InstallDocker extends Component<Props> {
  props: Props;

  state = {
    installing: false,
    installed: false,
    progress: 0
  };

  /**
   * @param {}
   *  changes state when installing begins
   */
  startInstall = () => {
    const { props } = this;

    const installErrorHandler = () => {
      props.transition(ERROR, {
        message: 'Docker Install Failed'
      });
    };
    this.setState({ installing: true });

    const dragAndDropCallback = response => {
      if (response.success) {
        props.transition(SUCCESS, {
          message: 'Configure Docker'
        });
      } else {
        installErrorHandler();
      }
    };

    const callback = response => {
      if (response.success) {
        if (response.finished) {
          this.setState({ installed: true });
          setTimeout(() => {
            this.setState({ installing: false });
            props.interface.handleDnD(
              response.data.downloadedFile,
              dragAndDropCallback
            );
          }, 3000);
        } else {
          this.setState({ progress: response.data.progress });
        }
      } else {
        this.setState({ installing: false });
        installErrorHandler();
      }
    };
    props.interface.download(callback);
  };

  render() {
    const { state, props } = this;
    const { machine, message } = props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={1}
          main={
            <InstallDockerMain
              installing={state.installing}
              installed={state.installed}
            />
          }
          status={
            <InstallDockerStatus
              startInstall={this.startInstall}
              installing={state.installing}
              installed={state.installed}
              progress={state.progress}
            />
          }
        />
      </div>
    );
  }
}
