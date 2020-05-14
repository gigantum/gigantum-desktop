// @flow
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// messenger
import ToolbarMessenger from './messenger/ToolbarMessenger';
// docker
import ToolbarInterface from '../libs/ToolbarInterface';
import Installer from '../libs/Installer';
// components
import routes from '../redux/constants/routes.json';
import Main from './containers/Main';

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  toolbarMessenger = new ToolbarMessenger();

  toolbarInterface = new ToolbarInterface();

  installer = new Installer();

  render() {
    const { storage } = this.props;
    return (
      <div className="Routes">
        <Router>
          <Switch>
            <Route
              storage={storage}
              path={routes.Main}
              component={renderProps => (
                <Main
                  storage={storage}
                  {...renderProps}
                  messenger={this.toolbarMessenger}
                  interface={this.toolbarInterface}
                />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
