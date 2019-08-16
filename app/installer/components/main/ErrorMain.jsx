// @flow
import React, { Component } from 'react';
// assets
import './ErrorMain.scss';

type Props = {};

export default class ErrorMain extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        <p>
          To begin the configuration process you must have at least <b>8GB</b>{' '}
          of disk space
        </p>
        <p>
          This is required to make sure you have enough storage to start
          working.
        </p>
      </div>
    );
  }
}
