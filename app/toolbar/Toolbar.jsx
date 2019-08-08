// @flow
import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// messenger
import ToolbarMessenger from './messenger/ToolbarMessenger';
// docker
import ToolbarInterface from '../libs/ToolbarInterface';
// components
import routes from '../redux/constants/routes';
import Info from './containers/Info';
import Main from './containers/Main';

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  toolbarMessenger = new ToolbarMessenger();

  toolbarInterface = new ToolbarInterface();

  interfaceFunction = interfaceToCall => {
    const callback = response => {
      console.log(response);
    };

    interfaceToCall(callback, true);
  };

  render() {
    const { storage } = this.props;
    return (
      <div className="Routes">
        <button
          type="button"
          onClick={() => this.toolbarMessenger.showInstaller()}
        >
          Show
        </button>
        <button
          type="button"
          onClick={() => this.toolbarMessenger.hideInstaller()}
        >
          hide
        </button>

        <button
          type="button"
          onClick={() => this.interfaceFunction(this.toolbarInterface.start)}
        >
          start
        </button>

        <button
          type="button"
          onClick={() => this.interfaceFunction(this.toolbarInterface.stop)}
        >
          stop
        </button>

        <button
          type="button"
          onClick={() => this.interfaceFunction(this.toolbarInterface.restart)}
        >
          restart
        </button>

        <button
          type="button"
          onClick={() => this.interfaceFunction(this.toolbarInterface.check)}
        >
          check
        </button>

        <Router>
          <Switch>
            <Route
              storage={storage}
              exact
              path={routes.Info}
              component={Info}
            />
            <Route
              storage={storage}
              path={routes.Main}
              component={renderProps => (
                <Main storage={storage} {...renderProps} />
              )}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
