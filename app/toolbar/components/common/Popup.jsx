// @flow
import React, { PureComponent } from 'react';
// assets
import './Popup.scss';

type Props = {};

export default class Popup extends PureComponent<Props> {
  props: Props;

  render() {
    return <div data-tid="container">Popup</div>;
  }
}
