// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
// componenets
import Header from '../components/Header';
import Setting from '../components/Setting';
// libs
import wslStatus from '../../libs/wslStatus';
// assets
import './Preferences.scss';

const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';

/**
  @param {Object} props
  @param {Object} state
  gets storage info to determine text
*/
const getText = (props, state) => {
  const { storage } = props;
  let shutDownDockerText = storage.get('close.dockerConfirm');
  let launchOnStartText = props.autoLaunch;
  let gigantumConfirmText = storage.get('close.gigantumConfirm');
  const browserText = storage.get('defaultBrowser') || 'Default';

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
    launchOnStartText: state.launchOnStartText || launchOnStartText,
    browserText: state.browserText || browserText
  };
};

/**
  @param {Object} state
  gets option data
*/
const getOptions = state => {
  const defaultOptions = ['Yes', 'No'];
  const dockerOptions = ['Yes', 'No', 'Prompt'];
  const saveDisabled =
    state.shutDownDockerText === null &&
    state.browserText === null &&
    state.launchOnStartText === null &&
    state.gigantumConfirmText === null;

  return {
    gigantumOptions: defaultOptions,
    launchOptions: defaultOptions,
    dockerOptions,
    browserOptions: ['Chrome', 'Firefox', 'Default'],
    saveDisabled
  };
};

export default class Preferences extends Component<Props> {
  props: Props;

  state = {
    gigantumDropdownVisible: false,
    dockerDropdownVisible: false,
    launchDropdownVisible: false,
    browserDropdownVisible: false,
    launchOnStartText: null,
    shutDownDockerText: null,
    gigantumConfirmText: null,
    browserText: null
  };

  componentDidMount = () => {
    const { storage } = this.props;
    const showWsl2Section = isWindows && storage.get('wslConfigured');
    wslStatus(
      () => this.setState({ showWsl2Section: false }),
      () => this.setState({ showWsl2Section: false }),
      () => this.setState({ showWsl2Section })
    );
  };

  /**
    @param {} 
    Enables WSL
  */
  enableWSL = () => {
    const { storage, messenger } = this.props;
    storage.set('wslConfigured', false);
    messenger.showInstaller();
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
      launchOnStartText,
      browserText
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
        props.messenger.closeSettings();
        props.messenger.setAutoLaunchOn();
      } else {
        props.messenger.setAutoLaunchOff();
      }
    }

    if (browserText) {
      if (browserText === 'Default') {
        storage.set('defaultBrowser', null);
      } else {
        storage.set('defaultBrowser', browserText);
      }
    }

    this.cancelPreference();
  };

  render() {
    const { props } = this;
    const {
      gigantumDropdownVisible,
      dockerDropdownVisible,
      launchDropdownVisible,
      browserDropdownVisible,
      showWsl2Section
    } = this.state;
    const { message } = props;
    const {
      shutDownDockerText,
      gigantumConfirmText,
      launchOnStartText,
      browserText
    } = getText(props, this.state);
    const {
      gigantumOptions,
      launchOptions,
      dockerOptions,
      saveDisabled,
      browserOptions
    } = getOptions(this.state);
    const gigantumConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': gigantumDropdownVisible,
      'Dropdown--collapsed': !gigantumDropdownVisible
    });

    const dockerConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': dockerDropdownVisible,
      'Dropdown--collapsed': !dockerDropdownVisible
    });

    const launchConfirmCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': launchDropdownVisible,
      'Dropdown--collapsed': !launchDropdownVisible
    });

    const launchBrowserCSS = classNames({
      'Dropdown relative': true,
      'Dropdown--open': browserDropdownVisible,
      'Dropdown--collapsed': !browserDropdownVisible
    });

    return (
      <div className="Preferences">
        <Header message={message} />
        <div className="Preferences__body">
          {!isLinux && (
            <div className="Preferences__category">
              <div className="Preferences__category-title">Startup</div>
              <Setting
                css={launchConfirmCSS}
                visible={launchDropdownVisible}
                settingsText="Start Gigantum Desktop at system start"
                currentText={launchOnStartText}
                options={launchOptions}
                listAction={() =>
                  this.toggleDropdown(
                    'launchDropdownVisible',
                    !launchDropdownVisible
                  )
                }
                itemAction={item =>
                  this.setPreference('launchOnStartText', item)
                }
              />
              <Setting
                css={launchBrowserCSS}
                visible={browserDropdownVisible}
                settingsText="Default Browser for launching"
                currentText={browserText}
                options={browserOptions}
                listAction={() =>
                  this.toggleDropdown(
                    'browserDropdownVisible',
                    !browserDropdownVisible
                  )
                }
                itemAction={item => this.setPreference('browserText', item)}
              />
            </div>
          )}
          <div className="Preferences__category">
            <div className="Preferences__category-title">Shutdown</div>
            <Setting
              css={gigantumConfirmCSS}
              visible={gigantumDropdownVisible}
              settingsText="Show confirmation when stopping Gigantum Client"
              currentText={gigantumConfirmText}
              options={gigantumOptions}
              listAction={() =>
                this.toggleDropdown(
                  'gigantumDropdownVisible',
                  !gigantumDropdownVisible
                )
              }
              itemAction={item =>
                this.setPreference('gigantumConfirmText', item)
              }
            />
            {isMac && (
              <Setting
                css={dockerConfirmCSS}
                visible={dockerDropdownVisible}
                settingsText="Shutdown Docker on Stop"
                currentText={shutDownDockerText}
                options={dockerOptions}
                listAction={() =>
                  this.toggleDropdown(
                    'dockerDropdownVisible',
                    !dockerDropdownVisible
                  )
                }
                itemAction={item =>
                  this.setPreference('shutDownDockerText', item)
                }
              />
            )}
          </div>

          {showWsl2Section && (
            <div className="Preferences__category flex">
              <div className="Preferences__category-title">Enable WSL2</div>
              <button
                type="button"
                className="Btn__Status Btn--primary"
                onClick={() => this.enableWSL()}
              >
                Enable WSL2
              </button>
            </div>
          )}

          <div className="Preferences__buttons">
            <button
              type="button"
              className="Btn--flat"
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
