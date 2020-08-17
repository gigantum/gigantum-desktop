// @flow
// vendor
import React, { Component } from 'react';
// utils
import { fetchAvailableServers } from './utils/fetchAvailableServers';
// components
import Row from './row/Row';
// css
import './AvailableServers.scss';

type Props = {
  uuid: string
};

class AvailableServers extends Component<Props> {
  state = {
    servers: []
  };

  componentDidMount() {
    const callback = servers => {
      this.setState({ servers });
    };
    fetchAvailableServers(callback);
  }

  componentDidUpdate(prevProps) {
    const callback = servers => {
      this.setState({ servers });
    };
    const { uuid } = this.props;
    if (uuid !== prevProps.uuid) {
      fetchAvailableServers(callback);
    }
  }

  render() {
    const { servers } = this.state;
    if (servers.length < 1) {
      return (
        <section>
          <h4 className="ManageServer__h4">Available Servers</h4>
          <p className="AvailableServers__p AvailableServers__p--error">
            There was a problem loading your configured servers, or you
            don&apos;t have any configured.
          </p>
        </section>
      );
    }

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
              <Row server={server.server} />
            ))}
          </tbody>
        </table>
      </section>
    );
  }
}

export default AvailableServers;
