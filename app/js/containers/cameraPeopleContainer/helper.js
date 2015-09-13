'use strict';
import http from '../../services/http';
import util from '../../util';

export default {
  filterInput,
  fetchData,
  buildJsonQuery,
  getGroupBy,
  processResult
};

function filterInput (query) {
  return (
    query.startDate &&
    query.endDate &&
    query.camera
  );
}

function fetchData (query) {
  let jsonQuery = R.compose(JSON.stringify, buildJsonQuery);
  return http.get('/api/people?json=' + jsonQuery(query));
}

function buildJsonQuery (query) {
  return {
      fields : {
        'time' : 'time',
        'sum(people_in)' : 'people'
      },
      where : {
        cam : query.camera._id,
        'date(time)' : {
          gte : moment(query.startDate)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss'),
          lt : moment(query.endDate)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss')
        },
        'hour(time)' : {
          gte : 9,
          lte : 20
        }
      },
      groupBy : ['date(time), hour(time)'],
      orderBy : {
        'time': true
      }
    };
}

function getGroupBy (query) {
  var start = query.startDate;
    var end = query.endDate;
    if (start.isSame(end, 'day')) {
      return ['hour(time)'];
    } else if (start.isSame(end, 'month')) {
      return ['date(time)'];
    }
    return ['month(time)'];
}

function processResult (data) {
  return R.map(e => {
    return {
      people: parseInt(e.people, 10) || 0,
      time: moment(e.time)
    };
  }, data);
}