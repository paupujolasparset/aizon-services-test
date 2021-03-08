'use strict';
const actions = require('./functions/actions');

exports.handler = async (event) => {
  let response = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let username, type, id;

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

  // Get the id
  if (event.pathParameters && event.pathParameters.id) {
    id = event.pathParameters.id;
  } else {
    response.statusCode = 400;
    response.body = 'Missing id';
    return response;
  }

  // Get the type (solution, screen or widget)
  if (event.queryStringParameters && event.queryStringParameters.serviceType) {
    type = event.queryStringParameters.serviceType;
  } else {
    response.statusCode = 400;
    response.body = 'Missing service type parameter';
    return response;
  }

  let res = await actions.get({ username, type, id });
  response.body = res.body;
  response.statusCode = res.statusCode;

  return response;
};
