// @flow
// vendor
import React, { Component } from 'react';
import classNames from 'classnames';
// utilities
import { addServer } from './utils/AddServer';
import utils from '../../libs/utilities';
// css
import './AddServer.scss';

type Props = {
  updateRenderId: Function
};

class AddServer extends Component<Props> {
  state = {
    url: '',
    button: 'add' // add, loading, done, error
  };

  /**
   * Method updates url in components state
   * @param {object} evt
   */
  updateUrl = evt => {
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
    const { updateRenderId } = this.props;
    const { url } = this.state;
    this.setState({ button: 'loading' });
    const callback = err => {
      setTimeout(() => {
        if (err) {
          this.setState({ button: 'error' });
        } else {
          this.setState({ button: 'done', url: '' });
        }
        updateRenderId();
      }, 1000);

      setTimeout(() => {
        this.setState({ button: 'add' });
      }, 10000);
    };
    const urlLastIndex = url.length - 1;
    const checkedUrl = url[urlLastIndex] === '/' ? url : `${url}/`;
    addServer(checkedUrl, callback);
  };

  render() {
    const { button, url } = this.state;
    const buttonDisabled = url === '' || button !== 'add';
    // declare css here
    const buttonCSS = classNames({
      'AddServer__button Btn': true,
      [`AddServer__button--${button}`]: true
    });
    return (
      <section>
        <h4 className="ManageServer__h4">Add Server</h4>
        <p className="AddServer__p">
          If you have access to a self-hosted Team or Enterprise Server, add it
          here. The server will then appear as an option on the Client login
          screen.{' '}
          <a
            role="presentation"
            onKeyUp={() => {}}
            onClick={() => utils.open('https://docs.gigantum.com/')}
          >
            Learn more.
          </a>
        </p>
        <div className="AddServer__container">
          <div className="AddServer___input flex">
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
          {button === 'error' && (
            <p className="AddServer__p AddServer__p--error">
              Failed to connect to the server provided. Make sure the url is
              formatted correctly.
            </p>
          )}
        </div>
      </section>
    );
  }
}

export default AddServer;
