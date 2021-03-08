/**
 * We use the node-fetch package to polyfill the fetch browser API.
 * This polyfill is needed for the Amplify package we require next,
 * which does the heavy lifting of talking to the Cognito service for us.
 */
global.fetch = require('node-fetch');
const Amplify = require('aws-amplify');
const config = require('../../aws-config.json');


// Configuring amplify authentication
Amplify.default.configure({
  Auth: {
    mandatorySignId: true,
    region: process.env.AWS_REGION || config.cognito.REGION,
    userPoolId: process.env.USER_POOL_ID || config.cognito.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_CLIENT_ID || config.cognito.USER_POOL_CLIENT_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

exports.signUp = async (username, password) => {
  try {
    await Amplify.Auth.signUp({
      username,
      password,
    });
  } catch (err) {
    throw err;
  }
};

exports.signIn = async (username, password) => {
  try {
    const user = await Amplify.Auth.signIn({username, password});
    return user.signInUserSession.idToken.jwtToken;
  } catch (err) {
    throw err;
  }
};

exports.signOut = async () => {
  try {
    await Amplify.Auth.signOut();
  } catch (err) {
    throw err;
  }
};
