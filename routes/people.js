// # Maps
// Endpoints for getting map data
//
'use strict';
var PeoplesService = require('../services/people'),
  lo = require('lodash'),
  middleware = require('../middleware');

// ## Read
//

exports.find = {
  handler : function (req) {
    return PeoplesService.find(req.query, req.session.user.company);
  },
  query : {
    additionalProperties : false,
    required : ['where'],
    properties : {
      fields : {
        type : 'object'
      },
      where : {
        type : 'object'
      },
      groupBy : {
        type : 'array'
      }
    }
  }
};
