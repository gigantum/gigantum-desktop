// @flow
import React, { Component } from 'react';
// constants
import { AKNOWLEDGEMENTS, RELEASE_NOTES } from '../machine/SettingsConstants';
// componenets
import Header from '../components/Header';
// libs
import Config from '../../libs/config';
// assets
import './About.scss';

export default class About extends Component<Props> {
  props: Props;

  /**
    @param {String} action
    sets transition of the state machine
  */
  handleTransition = action => {
    const { props } = this;
    const message =
      action === AKNOWLEDGEMENTS ? 'Aknowledgements' : 'Release Notes';
    props.transition(action, { message });
  };

  render() {
    const { message } = this.props;
    const desktopVersion = `Version: ${Config.version}`;
    const clientVersion = `Version: ${Config.clientVersion}`;
    const imageTag = `Image Tag: ${Config.imageTag}`;
    return (
      <div className="About">
        <Header message={message} />
        <div className="About__body">
          <div className="About__info">
            <div className="About__versionSections">
              <div className="About__sectionHeader">Gigantum Desktop</div>
              <div className="About__sectionText">{desktopVersion}</div>
            </div>
            <div className="About__versionSections">
              <div className="About__sectionHeader">Gigantum Client</div>
              <div className="About__sectionText">{clientVersion}</div>
              <div className="About__sectionText">{imageTag}</div>
            </div>
          </div>
          <div className="About__buttons">
            <div className="About__sectionHeader About__sectionHeader--buttons">
              View
            </div>
            <button
              type="button"
              className="Btn__Settings"
              onClick={() => this.handleTransition(AKNOWLEDGEMENTS)}
            >
              Acknowledgements
            </button>
            <button
              type="button"
              className="Btn__Settings"
              onClick={() => this.handleTransition(RELEASE_NOTES)}
            >
              Release Notes
            </button>
          </div>
        </div>
      </div>
    );
  }
}
