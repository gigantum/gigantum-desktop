// @flow
import React, { Component } from 'react';
// constants
import { ERROR, SUCCESS } from '../machine/InstallerConstants';
// containers
import Layout from './Layout';
// componenets
import ConfigureGigantumMain from '../components/main/ConfigureGigantumMain';
import ConfigureGigantumStatus from '../components/status/ConfigureGigantumStatus';
// assets
import './Container.scss';

export default class Checking extends Component<Props> {
  props: Props;

  state = {
    progress: 0
  };

  /**
   * @param {Boolean} skipConfigure
   *  configures gigantum
   */
  configureGigantum = () => {
    const { props } = this;
    const callback = response => {
      if (response.success) {
        if (response.data.finished) {
          this.setState({ progress: 100 });
          setTimeout(() => {
            props.transition(SUCCESS, {
              message: 'Configuration Complete'
            });
          }, 3000);
        } else {
          this.setState({ progress: response.data.percentage });
        }
      } else {
        props.transition(ERROR, {
          message: 'Gigantum Configuration Failed'
        });
      }
    };
    props.interface.configureGigantum(callback);
  };

  render() {
    const { props, state } = this;
    const { machine, message } = props;
    return (
      <div data-tid="container">
        <Layout
          currentState={machine.value}
          message={message}
          progress={3}
          main={<ConfigureGigantumMain />}
          status={
            <ConfigureGigantumStatus
              configureGigantum={this.configureGigantum}
              progress={state.progress}
            />
          }
        />
      </div>
    );
  }
}
