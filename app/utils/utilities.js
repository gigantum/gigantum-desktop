export default {
  /**
   * Loops through reservations and instances to find the current instance
   * @param {object} data
   * @param {Array} data.Reservations
   * @param {Array} data.Reservations.Instances
   * @param {Object} data.Reservations.Instances[0]
   * @param {Class} storage
   *
   * @return {object}
   */
  getCurrentInstance: (data, storage) => {
    let currentInstance = null;
    const userId = storage.get('userId');

    /**
     * pending, running, shutting-down, terminated, stopping, stopped
     */
    data.Reservations.forEach(reservation => {
      reservation.Instances.forEach(instance => {
        if (
          instance.KeyName === userId &&
          (instance.State.Name !== 'terminated' &&
            instance.State.Name !== 'shutting-down')
        ) {
          currentInstance = instance;
        }
      });
    });

    return currentInstance;
  },

  getStoredInstanceState: (data, storage) => {
    const userId = storage.get('userId');
    let instanceState = null;
    /**
     * pending, running, shutting-down, terminated, stopping, stopped
     */
    data.Reservations.forEach(reservation => {
      reservation.Instances.forEach(instance => {
        if (instance.KeyName === userId) {
          instanceState = instance.State.Name;
        }
      });
    });

    return instanceState;
  }
};
