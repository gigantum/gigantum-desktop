// @flow
export const UPDATE_AVAILABILITY_ZONES = 'UPDATE_AVAILABILITY_ZONES';
export const ADD_PRICING_DATA = 'ADD_PRICING_DATA';

export const updateAvailabilityZones = availabilityZones => ({
  type: UPDATE_AVAILABILITY_ZONES,
  availabilityZones
});

export const addPricingData = pricingData => ({
  type: ADD_PRICING_DATA,
  pricingData
});
