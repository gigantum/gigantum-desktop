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
    buttonType: 'add' // add, loading, done, error
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
    const urlHTTPS =
      url.indexOf('https://') < 0 && url.indexOf('http://') < 0
        ? `https://${url}`
        : url;

    this.setState({ buttonType: 'loading' });

    const callback = err => {
      setTimeout(() => {
        if (err) {
          this.setState({ buttonType: 'error' });
        } else {
          this.setState({ buttonType: 'done', url: '' });
        }
        updateRenderId();
      }, 1000);

      setTimeout(() => {
        this.setState({ buttonType: 'add' });
      }, 10000);
    };
    const urlLastIndex = urlHTTPS.length - 1;
    const checkedUrl =
      urlHTTPS[urlLastIndex] === '/' ? urlHTTPS : `${urlHTTPS}/`;

    addServer(checkedUrl, callback);
  };

  render() {
    const { buttonType, url } = this.state;
    const buttonDisabled = url === '' || buttonType !== 'add';
    // declare css here
    const buttonCSS = classNames({
      'AddServer__button Btn': true,
      [`AddServer__button--${buttonType}`]: true
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
          {buttonType === 'error' && (
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
