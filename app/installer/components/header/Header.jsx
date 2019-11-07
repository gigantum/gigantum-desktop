// @flow
import React, { Component } from 'react';
// assets
import './Header.scss';

type Props = {
  message: ''
};

export default class Header extends Component<Props> {
  props: Props;

  render() {
    const { message } = this.props;
    return <div className="InstallHeader">{message}</div>;
  }
}
