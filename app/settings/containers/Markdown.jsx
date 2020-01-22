// @flow
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
// constants
import {
  AKNOWLEDGEMENTS,
  RELEASE_NOTES,
  BACK
} from '../machine/SettingsConstants';
// componenets
import Header from '../components/Header';
// libs
import acknowledgements from '../../libs/gigantum.licenses.md';
import releaseNotes from '../../libs/gigantum.releaseNotes.md';
// assets
import './Markdown.scss';

export default class Markdown extends Component<Props> {
  props: Props;

  /**
    @param {} -
    sets transition of the state machine
  */
  goBack = () => {
    const { props } = this;
    props.transition(BACK, { message: 'About' });
  };

  render() {
    const { machine, message } = this.props;
    const markdownMap = {
      [AKNOWLEDGEMENTS]: acknowledgements,
      [RELEASE_NOTES]: releaseNotes
    };

    return (
      <div className="Markdown">
        <Header message={message} />
        <button
          type="button"
          className="Markdown__back"
          onClick={() => this.goBack()}
        />
        <div className="Markdown__body">
          <ReactMarkdown source={markdownMap[machine.value]} />
        </div>
      </div>
    );
  }
}
