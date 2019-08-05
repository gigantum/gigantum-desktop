// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import enterCredentials from './enterCredentials';
import createInstance from './createInstance';
import timer from './timer';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    timer,
    enterCredentials,
    createInstance
  });
}
