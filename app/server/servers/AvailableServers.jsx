// @flow
// vendor
import React, { Component } from 'react';
// utils
import { fetchAvailableServers } from './utils/fetchAvailableServers';
// css
import './AvailableServers.scss';

class AvailableServers extends Component {
  state = {
    servers: []
  };

  componentDidMount() {
    const callback = servers => {
      this.setState({ servers });
    };
    fetchAvailableServers(callback);
  }

  render() {
    const { servers } = this.state;
    console.log(servers);
    return (
      <section>
        <h4 className="ManageServer__h4">Available Servers</h4>
        <table className="AvailableServers__table">
          <thead className="AvailableServers__thead">
            <tr className="AvailableServers__tr">
              <th>Server Name</th>
              <th>Server URL</th>
            </tr>
          </thead>
          <tbody className="AvailableServers__tbody">
            {servers.map(server => (
              <tr className="AvailableServers__tr">
                <td>{server.server.name}</td>
                <td>{`https://${server.server.id}/`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default AvailableServers;
