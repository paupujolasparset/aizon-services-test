const actions = require('../api/services/functions/actions');
const users = require('../api/auth/user-actions');
const axios = require('axios');
require('dotenv').config();

/**
 * SIMULATE THE END TO END PROCESS OF CREATING SOME SERVICES, SCREENS
 * AND WIDGETS, UPDATE AND DELETE
 */
describe('Test Screen life cycle', () => {
  test('End to end services test', async () => {
    // This test can last longer than 5s.
    jest.setTimeout(30000);

    const username = 'bypet7@gmail.com';
    const validToken = await users.signIn(username, '1234Abcd$');

    // =================================================
    // Insert a solution
    // =================================================
    const solution1 = {
      PK: username,
      serviceType: 'solution',
      info: {
        name: 'TestSolution1',
        description: 'This is the Solution number 1',
      },
    };
    let response1 = await axios({
      method: 'post',
      url: process.env.API_URL + `/service?serviceType=${solution1.serviceType}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
      data: JSON.stringify(solution1.info),
    });
    solution1.SK = response1.data;

    // =================================================
    // Retrieve the solution and verify it
    // =================================================
    const readedSolution1 = await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/service/${solution1.SK}/?serviceType=${solution1.serviceType}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });

    expect(readedSolution1.data.Items).toContainEqual(solution1);

    // =================================================
    // Insert 2 Screens to that solution and one widget
    // to the first screen
    // =================================================
    const screen1 = {
      PK: username,
      serviceType: 'screen',
      info: {
        name: 'TestScreen1',
        description: 'This is the Screen number 1',
      },
    };
    let response2 = await axios({
      method: 'post',
      url:
        process.env.API_URL +
        `/service?serviceType=${screen1.serviceType}&parentId=${solution1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
      data: JSON.stringify(screen1.info),
    });
    screen1.SK = response2.data;

    const widget1 = {
      PK: username,
      serviceType: 'widget',
      info: {
        name: 'TestWidget1',
        description: 'This is the Widget number 1',
      },
    };
    let response3 = await axios({
      method: 'post',
      url:
        process.env.API_URL +
        `/service?serviceType=${widget1.serviceType}&parentId=${screen1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
      data: JSON.stringify(widget1.info),
    });
    widget1.SK = response3.data;

    const screen2 = {
      PK: username,
      serviceType: 'screen',
      info: {
        name: 'TestScreen2',
        description: 'This is the Screen number 2',
      },
    };
    let response4 = await axios({
      method: 'post',
      url:
        process.env.API_URL +
        `/service?serviceType=${screen2.serviceType}&parentId=${solution1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
      data: JSON.stringify(screen2.info),
    });
    screen2.SK = response4.data;

    // =================================================
    // Retrieving the list of screens
    // =================================================
    const readedScreens = await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/services?serviceType=screen&parentId=${solution1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });

    expect(readedScreens.data.Items).toEqual(
      expect.arrayContaining([screen1, screen2])
    );

    // =================================================
    // Delete Solution and check all childs has
    // been deleted
    // =================================================
    await axios({
      method: 'delete',
      url:
        process.env.API_URL +
        `/service/${solution1.SK}?serviceType=${solution1.serviceType}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });

    // Retrieving the solution
    const readedDeletedSolution = await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/services?serviceType=${solution1.serviceType}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });
    expect(readedDeletedSolution.data.Count).toEqual(0);

    // Retrieving the screen1
    const readedDeletedScreen1= await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/services?serviceType=${screen1.serviceType}&parentId=${solution1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });
    expect(readedDeletedScreen1.data.Count).toEqual(0);

    // Retrieving the widget1
    const readedDeletedWidget1 = await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/services?serviceType=${widget1.serviceType}&parentId=${screen1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });
    expect(readedDeletedWidget1.data.Count).toEqual(0);

    // Retrieving the screen2
    const readedDeletedScreen2 = await axios({
      method: 'get',
      url:
        process.env.API_URL +
        `/services?serviceType=${screen2.serviceType}&parentId=${solution1.SK}`,
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
    });
    expect(readedDeletedScreen2.data.Count).toEqual(0);
  });
});
