// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
// componenets
import Header from '../components/Header';
// assets
import './Preferences.scss';

export default class Preferences extends Component<Props> {
  props: Props;

  state = {
    gigantumDropdownVisible: false,
    dockerDropdownVisible: false,
    launchDropdownVisible: false,
    launchOnStartText: null,
    shutDownDockerText: null,
    gigantumConfirmText: null
  };

  /**
    @param {} -
    gets storage info to determine text
  */
  getText = () => {
    const { props, state } = this;
    const { storage } = props;
    let shutDownDockerText = storage.get('close.dockerConfirm');
    let launchOnStartText = storage.get('launchOnStart');
    let gigantumConfirmText = storage.get('close.gigantumConfirm');

    if (shutDownDockerText === undefined) {
      shutDownDockerText = 'Prompt';
    } else {
      shutDownDockerText = shutDownDockerText ? 'Yes' : 'No';
    }

    gigantumConfirmText = gigantumConfirmText ? 'No' : 'Yes';
    launchOnStartText = launchOnStartText ? 'Yes' : 'No';

    return {
      shutDownDockerText: state.shutDownDockerText || shutDownDockerText,
      gigantumConfirmText: state.gigantumConfirmText || gigantumConfirmText,
      launchOnStartText: state.launchOnStartText || launchOnStartText
    };
  };

  /**
    @param {String} section
    @param {boolean} visibility
    gets storage info to determine text
  */
  toggleDropdown = (section, visibility) => {
    this.setState({ [section]: visibility });
  };

  /**
    @param {String} section
    @param {String} text
    sets preference in state
  */
  setPreference = (section, text) => {
    this.setState({ [section]: text });
  };

  /**
    @param {} -
    resets preference in state
  */
  cancelPreference = () => {
    const { props } = this;
    props.messenger.closeSettings();
  };

  /**
    @param {} -
    saves preference in state
  */
  savePreference = () => {
    const { props, state } = this;
    const { storage } = props;
    const {
      shutDownDockerText,
      gigantumConfirmText,
      launchOnStartText
    } = state;
    if (shutDownDockerText) {
      if (shutDownDockerText === 'Yes') {
        storage.set('close.dockerConfirm', true);
      } else if (shutDownDockerText === 'No') {
        storage.set('close.dockerConfirm', false);
      } else {
        storage.set('close.dockerConfirm', undefined);
      }
    }

    if (gigantumConfirmText) {
      if (gigantumConfirmText === 'Yes') {
        storage.set('close.gigantumConfirm', false);
      } else {
        storage.set('close.gigantumConfirm', true);
      }
    }

    if (launchOnStartText) {
      if (launchOnStartText === 'Yes') {
        storage.set('launchOnStart', true);
      } else {
        storage.set('launchOnStart', false);
      }
    }

    this.cancelPreference();
  };

  render() {
    const { props, state } = this;
    const { message } = props;
    const {
      shutDownDockerText,
      gigantumConfirmText,
      launchOnStartText
    } = this.getText();
    const gigantumOptions = ['Yes', 'No'];
    const launchOptions = ['Yes', 'No'];
    const dockerOptions = ['Yes', 'No', 'Prompt'];
    const saveDisabled =
      state.shutDownDockerText === null &&
      state.launchOnStartText === null &&
      state.gigantumConfirmText === null;

    const gigantumConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': state.gigantumDropdownVisible,
      'Dropdown--collapsed': !state.gigantumDropdownVisible
    });

    const dockerConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': state.dockerDropdownVisible,
      'Dropdown--collapsed': !state.dockerDropdownVisible
    });

    const launchConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': state.launchDropdownVisible,
      'Dropdown--collapsed': !state.launchDropdownVisible
    });

    return (
      <div className="Preferences">
        <Header message={message} />
        <div className="Preferences__body">
          <div className="Preferences__category">
            <div className="Preferences__category-title">Startup</div>
            <div className="Preferences__setting">
              <div className="Preferences__text">
                Start Gigantum Desktop at system start
              </div>
              <div
                className={launchConfirmCSS}
                onClick={() =>
                  this.toggleDropdown(
                    'launchDropdownVisible',
                    !state.launchDropdownVisible
                  )
                }
                onKeyDown={() =>
                  this.toggleDropdown(
                    'launchDropdownVisible',
                    !state.launchDropdownVisible
                  )
                }
                role="button"
                tabIndex="0"
              >
                {launchOnStartText}
                <ul className="Dropdown__menu">
                  {state.launchDropdownVisible &&
                    launchOptions.map(item => (
                      <li
                        className="Dropdown__item"
                        key={item}
                        role="menuitem"
                        onClick={() =>
                          this.setPreference('launchOnStartText', item)
                        }
                        onKeyDown={() =>
                          this.setPreference('launchOnStartText', item)
                        }
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="Preferences__category">
            <div className="Preferences__category-title">Shutdown</div>
            <div className="Preferences__setting">
              <div className="Preferences__text">
                Show confirmation when stopping Gigantum Client
              </div>
              <div
                className={gigantumConfirmCSS}
                onClick={() =>
                  this.toggleDropdown(
                    'gigantumDropdownVisible',
                    !state.gigantumDropdownVisible
                  )
                }
                onKeyDown={() =>
                  this.toggleDropdown(
                    'gigantumDropdownVisible',
                    !state.gigantumDropdownVisible
                  )
                }
                role="button"
                tabIndex="-1"
              >
                {gigantumConfirmText}
                <ul className="Dropdown__menu">
                  {state.gigantumDropdownVisible &&
                    gigantumOptions.map(item => (
                      <li
                        className="Dropdown__item"
                        key={item}
                        role="menuitem"
                        onClick={() =>
                          this.setPreference('gigantumConfirmText', item)
                        }
                        onKeyDown={() =>
                          this.setPreference('gigantumConfirmText', item)
                        }
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="Preferences__setting">
              <div className="Preferences__text">Shutdown Docker on Stop</div>
              <div
                className={dockerConfirmCSS}
                onClick={() =>
                  this.toggleDropdown(
                    'dockerDropdownVisible',
                    !state.dockerDropdownVisible
                  )
                }
                onKeyDown={() =>
                  this.toggleDropdown(
                    'dockerDropdownVisible',
                    !state.dockerDropdownVisible
                  )
                }
                role="button"
                tabIndex="-2"
              >
                {shutDownDockerText}
                <ul className="Dropdown__menu">
                  {state.dockerDropdownVisible &&
                    dockerOptions.map(item => (
                      <li
                        className="Dropdown__item"
                        key={item}
                        role="menuitem"
                        onClick={() =>
                          this.setPreference('shutDownDockerText', item)
                        }
                        onKeyDown={() =>
                          this.setPreference('shutDownDockerText', item)
                        }
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="Preferences__buttons">
            <button
              type="button"
              className="Btn--flat"
              disabled={saveDisabled}
              onClick={() => this.cancelPreference()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="Btn__Settings Btn--primary Btn--last"
              onClick={() => this.savePreference()}
              disabled={saveDisabled}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
