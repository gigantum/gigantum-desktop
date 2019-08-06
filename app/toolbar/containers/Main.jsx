// @flow
import React, { Component } from 'react';
import Status from '../components/status/Status';
// assets
import './Main.scss';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div data-tid="container">
        <Status />
      </div>
    );
  }
}
