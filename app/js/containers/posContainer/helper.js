'use strict';
import http from '../../services/http';
import util from '../../util';

const filterInput = query => (query.startDate && query.endDate && query.store);
const buildJsonQuery = query => {
  return {
    "fields" : {
      "sum(revenue)" : "revenue",
      "sum(transactions)" : "transactions",
      [util.queryDateFormat(query.startDate, query.endDate)]: "time"
    },
    "where" : {
      "store" : query.store._id,
      'date(time)' : {
        gte : moment(query.startDate)
          .format('YYYY-MM-DD'),
        lte : moment(query.endDate)
          .format('YYYY-MM-DD'),
      }
    },
    "groupBy": util.queryDateFormat(query.startDate, query.endDate),
    "orderBy" : {
      time : true
    }
  };
};
const parseNumbersAndDates = (data) => {
  return {
    revenue: parseFloat(data.revenue) || 0,
    transactions: parseFloat(data.transactions) || 0,
    time: moment(data.time)
  };
};

const fetchData = query => {
  const fillResultGaps = util.fillDataGaps(moment(query.startDate.format('YYYY-MM-DD 9:00:00')), moment(query.endDate.format('YYYY-MM-DD 22:00:00')), {revenue: 0, transactions:0});
  return R.compose(http.get, query => `/api/pos?json=${query}`, encodeURIComponent, JSON.stringify, buildJsonQuery)(query)
    .map(R.map(parseNumbersAndDates))
    .tap(logger.log('POSCONTAINER'))
    .map(fillResultGaps)
};

export default {
  filterInput,
  fetchData,
  buildJsonQuery,
  parseNumbersAndDates
};
