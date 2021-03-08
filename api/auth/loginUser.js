'use strict';
const users = require('./user-actions');

exports.handler = async (event) => {
  let response = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
	let body = JSON.parse(event.body);

  if (body && body.username && body.password) {
    try {
      const token = await users.signIn(body.username, body.password);
      response.statusCode = 201;
      response.body = JSON.stringify({ token });
    } catch (err) {
      response.statusCode = 400;
      response.body = JSON.stringify({ message: err });
    }
  } else {
    response.statusCode = 401;
    response.body = JSON.stringify({
      message: 'Username and password must be informed',
    });
  }

  return response;
};


