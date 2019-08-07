// @flow
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// components
import Toolbar from './toolbar/Toolbar';
import Installer from './installer/Installer';

class ViewManager extends Component {
  static Views() {
    return {
      toolbar: <Toolbar />,
      installer: <Installer />
    };
  }

  static View(props) {
    const name = props.location.search.substr(1);
    const view = ViewManager.Views()[name];

    if (view == null) {
      throw new Error(view);
    }
    return view;
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={ViewManager.View} />
        </div>
      </Router>
    );
  }
}

export default ViewManager;
