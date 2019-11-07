// @flow
export const UPDATE_REGIONS = 'UPDATE_REGIONS';
export const UPDATE_AVAILABILITY_ZONES = 'UPDATE_AVAILABILITY_ZONES';

export const updateRegions = regions => ({
  type: UPDATE_REGIONS,
  regions
});

export const updateAvailabilityZones = availabilityZones => ({
  type: UPDATE_AVAILABILITY_ZONES,
  availabilityZones
});
