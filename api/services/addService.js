'use strict';
const actions = require('./functions/actions')

exports.handler = async (event) => {
  let response = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let username, type, parentId, body;

  if (
    event.requestContext.authorizer &&
    event.requestContext.authorizer.claims
  ) {
    username = event.requestContext.authorizer.claims.email;
  } else {
    response.statusCode = 401;
    response.body = 'Missing username';
    return response;
  }

  if (event.queryStringParameters && event.queryStringParameters.parentId) {
    parentId = event.queryStringParameters.parentId;
  }

  if (event.queryStringParameters && event.queryStringParameters.serviceType) {
    type = event.queryStringParameters.serviceType;
  } else {
    response.statusCode = 400;
    response.body = 'Missing service type parameter';
    return response;
  }

  if (event.body) {
    body = JSON.parse(event.body);
  }

  let res = await actions.add({ username, type, parentId, body });
  response.body = res.body;
  response.statusCode = res.statusCode;
  return response;
};
