'use strict';
export default (http) => {
  const observer = new Bacon.Bus();

  const observable = observer
    .filter(x => !R.isNil(x))
    .map(id => `/api/cameras/${id}`)
    .flatMap(http.get)
    .doError(logger.error('CameraContainer Error:'))
    .toProperty();

  return {
    observer,
    observable
  };
};
