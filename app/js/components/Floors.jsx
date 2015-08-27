'use strict';
import {Link} from 'react-router';
import cameraListContainer from '../containers/cameraListContainer';

var cameraStyle = R.curry(function cameraStyle (cam) {
  return {
    left: cam.pos.x + '%',
    top: cam.pos.y + '%'
  };
});

var _printCamera = R.curry(function (storeId, cam) {
  const cameraId = cam._id;
   return  (
     <Link to="camera" params={{storeId, cameraId}}>
      <div className="font-size-large absolute glyphicon glyphicon-map-marker text-primary" style={cameraStyle(cam)}></div>
     </Link>
   );
})

var _printFloor = R.curry(function (printCamera, floorCameraPair) {
  return (
    <div className="col-xs-8 col-xs-offset-2 gutter-bottom">
      <div className="paper relative">
        <img className="block" src={`/api/stores/floorplans/${R.head(floorCameraPair)}.jpg`}/>
        {R.map(printCamera, R.last(floorCameraPair))}
      </div>
    </div>
  );
});

var _printFloorList = R.curry(function (printFloor, cameraList) {
  const floorCameraPairs = R.compose(R.reverse, R.toPairs, R.groupBy(R.prop('floor')));
  const printFloors = R.compose(R.map(printFloor), floorCameraPairs);
  return printFloors(cameraList);
});

export default React.createClass({
  observers: [],
  getInitialState () {
    return {
      cameraList: []
    };
  },

  componentDidMount () {
    document.title = 'Sentia Analytics - Floors';
    this.disposable = cameraListContainer.observable
      .subscribe(cameraList => this.setState({cameraList}));
  },

  componentWillUnmount () {
    this.disposable.dispose();
  },

  render () {
    var printCamera = _printCamera(this.props.params.storeId);
    var printFloor = _printFloor(printCamera);
    var printFloorList = _printFloorList(printFloor);
    return (
      <div className="gutter-top gutter-bottom">
        <div className="container-fluid">
          {printFloorList(this.state.cameraList)}
        </div>
      </div>
    );
  }
});
