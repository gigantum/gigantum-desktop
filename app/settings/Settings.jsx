// @flow
import * as React from 'react';
import AutoLaunch from 'auto-launch';
// States
import {
  AKNOWLEDGEMENTS,
  RELEASE_NOTES,
  ABOUT,
  PREFERENCES
} from './machine/SettingsConstants';
import stateMachine from './machine/SettingsMachine';
// messenger
import SettingsMessenger from './messenger/SettingsMessenger';
// containers
import About from './containers/About';
import Markdown from './containers/Markdown';
import Preferences from './containers/Preferences';
// assets
import './Settings.scss';

type Props = {
  location: {
    search: {
      substr: ''
    }
  }
};

const gigantumAutoLauncher = new AutoLaunch({
  name: 'Gigantum',
  path: '/Applications/Gigantum.app'
});

export default class Settings extends React.Component<Props> {
  props: Props;

  state = {
    machine: stateMachine.initialState,
    message: 'About',
    autoLaunch: false
  };

  componentWillMount = () => {
    const { props } = this;
    const subString = props.location.search.substr(1).split('&')[1];
    const section = subString.split('=')[1];
    const message = section === 'about' ? 'About' : 'Preferences';
    gigantumAutoLauncher
      .isEnabled()
      .then(response => this.setState({ autoLaunch: response }))
      .catch(error => console.log(error));
    this.setState({ message });
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
    const renderValue =
      state.message === 'Preferences' ? PREFERENCES : state.machine.value;

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
          gigantumAutoLauncher={gigantumAutoLauncher}
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
