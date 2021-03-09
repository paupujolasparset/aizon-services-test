/**
 * We use the node-fetch package to polyfill the fetch browser API.
 * This polyfill is needed for the Amplify package we require next,
 * which does the heavy lifting of talking to the Cognito service for us.
 */
global.fetch = require('node-fetch');
const Amplify = require('aws-amplify');

// Configuring amplify authentication
Amplify.default.configure({
  Auth: {
    mandatorySignId: true,
    region: process.env.AWS_REGION,
    userPoolId: 'eu-central-1_9PKEOHcBh',
    userPoolWebClientId: '7qavkd639b2plf95so80572k40',
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
});

exports.signUp = async (username, password) => {
  try {
    await Amplify.Auth.signUp({
      username,
      password,
    });
    return;
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
