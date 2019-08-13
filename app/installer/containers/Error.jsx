// @flow
import React, { Component } from 'react';
// assets
import './Container.scss';

type Props = {
  children: React.Node
};

export default class Container extends Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <div data-tid="container">
        <React.Fragment>{children}</React.Fragment>
      </div>
    );
  }
}
