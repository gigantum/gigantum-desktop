import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type timerStateType = {
  +time: number,
  +date: number
};

export type enterCredentialsStateType = {
  +regions: array,
  +availabilityZones: array
};

export type createInstanceStateType = {
  +availabilityZones: array,
  +pricingData: {}
};

export type Action = {
  +type: string
};

export type GetState = () => timerStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
