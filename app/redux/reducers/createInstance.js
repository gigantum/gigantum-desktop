// @flow
import {
  UPDATE_AVAILABILITY_ZONES,
  ADD_PRICING_DATA
} from '../actions/createInstance';
import type { Action, createInstanceStateType } from './types';

const createInstance = (
  state: createInstanceStateType = { availabilityZones: [], pricingData: {} },
  action: Action
) => {
  switch (action.type) {
    case UPDATE_AVAILABILITY_ZONES:
      return {
        ...state,
        availabilityZones: action.availabilityZones
      };
    case ADD_PRICING_DATA:
      return {
        ...state,
        pricingData: action.pricingData
      };
    default:
      return state;
  }
};

export default createInstance;
