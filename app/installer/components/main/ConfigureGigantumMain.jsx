// @flow
import React, { Component } from 'react';
// assets
import './ConfigureGigantumMain.scss';

type Props = {};

export default class ConfigureGigantum extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className="Layout__Main">
        The final step is to download the Gigantum Client container.
        <br />
        <br />
        Depending on your internet speed, this should take no more than 5
        minutes.
      </div>
    );
  }
}
