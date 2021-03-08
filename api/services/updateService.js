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
  let id = undefined;
  let body = undefined;

  // Get the username
  if (event.headers && event.headers['username']) {
    username = event.headers.username;
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
  if (
    event.requestContext.authorizer &&
    event.requestContext.authorizer.claims
  ) {
    username = event.requestContext.authorizer.claims.email;
  } else {
    response.statusCode = 400;
    response.body = 'Missing service type parameter';
    return response;
  }

  if (event.body) {
    body = JSON.parse(event.body);
  }

  let res = await actions.list({ username, type, id, body });
  response.body = res.body;
  response.statusCode = res.statusCode;

  return response;
};
