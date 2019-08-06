// @flow
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from '../redux/constants/routes';
import Info from './containers/Info';
import Main from './containers/Main';

ipcRenderer.send(
  'asynchronous-message',
  'This message goes back to the main window.'
);

type Props = {
  storage: object
};

export default class Routes extends Component<Props> {
  nativeWindowObject: null;

  // componentWillMount() {
  //   this.nativeWindowObject = window.open('', 800, 500);
  // }

  render() {
    const { storage } = this.props;
    //
    // if(this.nativeWindowObject ) {
    //   return ReactDOM.createPortal(Installer, this.nativeWindowObject.document.body)
    // }

    return (
      <div className="Routes">
        <Router>
          <Switch>
            <Route
              storage={storage}
              exact
              path={routes.Info}
              component={Info}
            />
            <Route storage={storage} path={routes.Main} component={Main} />
          </Switch>
        </Router>
      </div>
    );
  }
}
