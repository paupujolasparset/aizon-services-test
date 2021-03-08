'use strict';
const users = require('./user-actions');

exports.handler = async (event) => {
  let response = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const token = await users.signOut();
    response.statusCode = 201;
    response.body = JSON.stringify({ message: 'Logged Out' });
  } catch (err) {
    response.statusCode = 400;
    response.body = JSON.stringify({ message: err });
  }

  return response;
};
