// @flow
import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import routes from '../../redux/constants/routes';
import Info from './Info';
import Main from './Main';

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  render() {
    const { storage } = this.props;
    return (
      <Switch>
        <Route storage={storage} exact path={routes.Info} component={Info} />
        <Route storage={storage} exact path={routes.Main} component={Main} />
      </Switch>
    );
  }
}
