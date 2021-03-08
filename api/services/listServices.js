'use strict';
const actions = require('./functions/actions');

exports.handler = async (event) => {
  let response = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let username = undefined;
  let type = undefined;
  let parentId = undefined;

  // Get the username
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

  // Get the parent id (if any)
  if (event.queryStringParameters && event.queryStringParameters.parentId) {
    parentId = event.queryStringParameters.parentId;
  }

  // Get the type (solution, screen or widget)
  if (event.queryStringParameters && event.queryStringParameters.serviceType) {
    type = event.queryStringParameters.serviceType;
  } else {
    response.statusCode = 400;
    response.body = 'Missing service type parameter';
    return response;
  }

  let res = await actions.list({ username, type, parentId });
  response.body = res.body;
  response.statusCode = res.statusCode;

  return response;
};
