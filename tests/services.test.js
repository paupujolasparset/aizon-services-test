const actions = require('../api/services/functions/actions');
const users = require('../api/auth/user-actions');
const config = require('../aws-config.json');
const axios = require('axios');


/**
 * SIMULATE THE END TO END PROCESS OF CREATING SOME SERVICES, SCREENS 
 * AND WIDGETS, UPDATE AND DELETE
 */
describe('Test cognito authentication', () => {
  test('End to end services test', async () => {
		let validToken = await users.signIn('bypet7@gmail.com', '1234Abcd$');
    const response = await axios.post(`${config.ServiceURL}/service`, {
      headers: {
        Authorization: 'Bearer ' + validToken,
      },
      params: {
        serviceType: 'solution',
      },
      body: {
        name: 'testSolution1',
        desc: 'This is a test solution',
      },
		})
		console.log(response)
	}
		
		// mockUser = {
		// 	username: 'testUser',
		// 	password: '1234Abcd$'
		// }

		// mockSolution1 = {
		// 	type: 'solution',
		// 	parentId: undefined,
		// 	body: {
		// 		name: 'testSolution1',
		// 		desc: 'This is a test solution'
		// 	}
		// }

		// const mockSolution1Id = await actions.add({
    //   username: mockUser.username,
    //   type: mockSolution1.type,
    //   parentId: mockSolution1.parentId,
    //   body: mockSolution1.body,
		// });
		// console.log(mockSolution1Id)
    // expect(mockSolution1Id).toBeTruthy();
    
  });
});
