// @flow
import React, { Component } from 'react';
// Components
import Faq from '../components/faq/Faq';
import Header from '../components/header/Header';
import ProgressBar from '../components/progressbar/ProgressBar';
// assets
import './Layout.scss';

type Props = {
  main: React.Node,
  status: React.Node,
  currentState: string,
  message: '',
  progress: number
};

export default class Container extends Component<Props> {
  props: Props;

  render() {
    const { main, status, currentState, message, progress } = this.props;

    return (
      <div data-tid="container">
        <Header message={message} />
        <div className="Layout__Body">
          <Faq currentState={currentState} />
          <React.Fragment>{main}</React.Fragment>
          <React.Fragment>{status}</React.Fragment>
        </div>
        <ProgressBar progress={progress} />
      </div>
    );
  }
}
