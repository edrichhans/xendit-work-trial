const supertest = require('supertest');
const request = supertest(spacepackApiApp);

describe('User', function(){
  it('should be able to create user', async function(){
    const response = await request.post('/signup').send({
      username: 'userName',
      password: '123123123',
    });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('userName')
    expect(response.body.API_key).not.toBe(null)
  });
});