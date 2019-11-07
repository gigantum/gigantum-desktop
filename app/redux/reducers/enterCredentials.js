// @flow
import {
  UPDATE_REGIONS,
  UPDATE_AVAILABILITY_ZONES
} from '../actions/enterCredentials';
import type { Action, enterCredentialsStateType } from './types';

const enterCredentials = (
  state: enterCredentialsStateType = { regions: [], availabilityZones: [] },
  action: Action
) => {
  switch (action.type) {
    case UPDATE_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case UPDATE_AVAILABILITY_ZONES:
      return {
        ...state,
        availabilityZones: action.availabilityZones
      };
    default:
      return state;
  }
};

export default enterCredentials;
