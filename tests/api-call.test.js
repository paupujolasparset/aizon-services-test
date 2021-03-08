const users = require('../api/auth/user-actions');
const config = require('../aws-config.json');
const axios = require('axios');

describe('Test cognito axios call', () => {
  
  test('Get services list of authenticated user', async () => {
		let validToken = await users.signIn('bypet7@gmail.com', '1234Abcd$');
		const response = await axios.get(`${config.ServiceURL}/services`, {
			headers: {
				"Authorization" : 'Bearer ' + validToken
			}, params: {
				serviceType: 'solution'
			}
		});
    
		expect(response.data).toMatchObject({
      Items: expect.any(Array),
      Count: expect.any(Number),
      ScannedCount: expect.any(Number),
    });
	});
	
	test('Get unauthorized when getting the services of an non authenticated user', async () => {
    let invalidToken = 'PyJraWQiOiJ2NEk0TEJJczN6d21UMUtvelJEangrOUhHc0RzVWJ1KzdwWlpMSllRZ2E4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI3MzkxZTM5Ny02ZWVkLTQ3NjMtYWNhNC1kMWQyZGNiMzhiMzQiLCJhdWQiOiI3cWF2a2Q2MzliMnBsZjk1c284MDU3Mms0MCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJldmVudF9pZCI6IjQ3NjA0MDk2LTg2MGYtNDFmYS05YjFkLTZkMWE1NTNhZDdiMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjE1MTgzMTAxLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV85UEtFT0hjQmgiLCJjb2duaXRvOnVzZXJuYW1lIjoiNzM5MWUzOTctNmVlZC00NzYzLWFjYTQtZDFkMmRjYjM4YjM0IiwiZXhwIjoxNjE1MTg2NzAxLCJpYXQiOjE2MTUxODMxMDEsImVtYWlsIjoiYnlwZXQ3QGdtYWlsLmNvbSJ9.G4GwdypXsgGpDsCKtAIlgFA7p68Tn5Dcojn5OfmJjbKRPOb3cWjv1svHlTcsCDxJQYB34Bja6Z0ChHznvY5i3x2ZcPIKaFlWAO67anjk0NSrfP4t6pnLO-_5n8my5gxrKqlREwc1UuhmeIIwCYdrD7gp_iWgXISBAOdYXaF5VIBsGP84jIlEfisw52S2oh015PSX6qXQTdxLAJAT784IeY6aBfcTT7oqwObgVRhkanjErqWYbKqY4pkKQP_JVNmOPv0AGGNfHV8-FYNi-Sjy8aE0H2Pde5yT6k3dNvuUO0xbZeTbbtgX5Jc9qUp5sjH0enW-C6xh9KQ_pNMOnytcDg';
    
    try {
      await axios.get(`${config.ServiceURL}/services`, {
        headers: {
          Authorization: 'Bearer ' + invalidToken,
        },
        params: {
          serviceType: 'solution',
        },
      });
    } catch (err) {
			expect(err.response.status).toBe(401)
    }
  });

});
