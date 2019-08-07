// @flow
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from '../redux/store/configureStore';
// import '../assets/css/critical.scss';
import Storage from '../storage/Storage';
// components
import Routes from './containers/Routes';

const storage = new Storage();

const store = configureStore();

render(
  <AppContainer>
    <Routes store={store} history={history} storage={storage} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Routes', () => {
    // eslint-disable-next-line global-require
    const NextRoutes = require('./containers/Routes').default;
    render(
      <AppContainer>
        <NextRoutes store={store} history={history} storage={storage} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
