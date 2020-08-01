// @flow
// vendor
import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
// components
import Header from '../settings/components/Header';
import AvailableServers from './servers/AvailableServers';
import AddServer from './add/AddServer';
// css
import './ManageServer.scss';

class ManageServer extends Component {
  state = {
    uuid: 'first'
  };

  /**
   * Method updates state to trigger rerender in available servers after a server is added
   * @param {}
   * @return {}
   */
  updateRenderId = () => {
    this.setState({ uuid: uuidv4() });
  };

  render() {
    const { uuid } = this.state;
    return (
      <div className="ManageServer">
        <Header message="Manage Server" />
        <div className="ManageServer__container">
          <AddServer updateRenderId={this.updateRenderId} />
          <AvailableServers uuid={uuid} />
        </div>
      </div>
    );
  }
}

export default ManageServer;
