// @flow
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureStore, history } from '../redux/store/configureStore';
import Container from './containers/Container';
// import '../assets/css/critical.scss';
import Storage from '../storage/Storage';

const storage = new Storage();

const store = configureStore();

render(
  <AppContainer>
    <Container store={store} history={history} storage={storage} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Containers', () => {
    // eslint-disable-next-line global-require
    const NewContainer = require('./containers/Container').default;
    render(
      <AppContainer>
        <NewContainer store={store} history={history} storage={storage} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
