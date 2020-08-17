// @flow
import * as React from 'react';
import { remote } from 'electron';
// States
import {
  AKNOWLEDGEMENTS,
  RELEASE_NOTES,
  ABOUT,
  PREFERENCES,
  MANAGE_SERVER
} from './machine/SettingsConstants';
import stateMachine from './machine/SettingsMachine';
// messenger
import SettingsMessenger from './messenger/SettingsMessenger';
// containers
import About from './containers/About';
import Markdown from './containers/Markdown';
import Preferences from './containers/Preferences';
import ManageServer from '../server/ManageServer';
// assets
import './Settings.scss';

const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

type Props = {
  location: {
    search: {
      substr: ''
    }
  }
};

class Settings extends React.Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState,
    message: 'About',
    autoLaunch: false
  };

  componentWillMount = () => {
    const { props } = this;
    const subString = props.location.search.substr(1).split('&')[1];
    const section = capitalize(subString.split('=')[1]);
    const autoLaunch = remote.getCurrentWindow().openAtLogin;
    this.setState({ message: section, autoLaunch });
  };

  messenger = new SettingsMessenger();

  /**
    @param {string} eventType
    @param {object} nextState
    sets transition of the state machine
  */
  transition = (eventType, nextState) => {
    const { state } = this;

    const newState = stateMachine.transition(state.machine.value, eventType, {
      state
    });

    this.setState({
      machine: newState,
      message: nextState && nextState.message ? nextState.message : ''
    });
  };

  render() {
    const { props, state, transition, messenger } = this;
    const renderValue = {
      Preferences: PREFERENCES,
      About: ABOUT,
      ManageServer: MANAGE_SERVER,
      'Release Notes': RELEASE_NOTES,
      Aknowledgements: AKNOWLEDGEMENTS
    }[state.message];
    const renderMap = {
      [ABOUT]: <About {...props} {...state} transition={transition} />,
      [RELEASE_NOTES]: (
        <Markdown {...props} {...state} transition={transition} />
      ),
      [AKNOWLEDGEMENTS]: (
        <Markdown {...props} {...state} transition={transition} />
      ),
      [PREFERENCES]: (
        <Preferences
          {...props}
          {...state}
          transition={transition}
          messenger={messenger}
        />
      ),
      [MANAGE_SERVER]: (
        <ManageServer
          {...props}
          {...state}
          transition={transition}
          messenger={messenger}
        />
      )
    };
    return (
      <div className="Settings">
        {renderMap[renderValue]}
        <button
          className="Settings__close"
          type="button"
          onClick={() => this.messenger.closeSettings()}
        />
      </div>
    );
  }
}

export default Settings;
