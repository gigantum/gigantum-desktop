// @flow
// vendor
import React, { Component } from 'react';
import classNames from 'classnames';
// components
import Header from '../settings/components/Header';
import AvailableServers from './servers/AvailableServers';
// utilities
import { addServer } from './add/AddServer';
// css
import './ManageServer.scss';

class ManageServer extends Component {
  state = {
    url: '',
    button: 'add' // add, loading, done, error
  };

  /**
   * Method updates url in components state
   * @param {object} evt
   */
  updateUrl = evt => {
    console.log(evt.key);

    if (evt.key === 'Enter') {
      this.addServer();
    } else {
      this.setState({ url: evt.target.value });
    }
  };

  /**
   * Method updates url in components state
   * @param {object} evt
   */
  addServer = () => {
    const { url } = this.state;
    this.setState({ button: 'loading' });
    const callback = err => {
      setTimeout(() => {
        if (err) {
          this.setState({ button: 'error' });
        } else {
          this.setState({ button: 'done' });
        }
      }, 1000);

      setTimeout(() => {
        this.setState({ button: 'add' });
      }, 10000);
    };
    addServer(url, callback);
  };

  render() {
    const { button, url } = this.state;
    const buttonDisabled = url === '' || button !== 'add';
    // declare css here
    const buttonCSS = classNames({
      'ManageServer__button Btn': true,
      [`ManageServer__button--${button}`]: true
    });
    return (
      <div className="ManageServer">
        <Header message="Manage Server" />
        <div className="ManageServer__container">
          <section>
            <h4 className="ManageServer__h4">Add Server</h4>
            <div className="flex">
              <input
                placeholder="Enter server url here"
                onKeyUp={evt => this.updateUrl(evt)}
                onChange={evt => this.updateUrl(evt)}
                type="text"
                value={url}
              />
              <button
                className={buttonCSS}
                disabled={buttonDisabled}
                onClick={() => this.addServer()}
                type="button"
              />
            </div>
            <p>
              If you have access to a self-hosted Team or Enterprise Server, add
              it here. The server will then appear as an option on the Client
              login screen. <a href="https://docs.gigantum.com/">Learn more.</a>
            </p>
          </section>
          <AvailableServers />
        </div>
      </div>
    );
  }
}

export default ManageServer;
