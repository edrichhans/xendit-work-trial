const supertest = require('supertest');
const request = supertest(spacepackApiApp);

describe('No account', function(){
  it('should fail to subscribe (no account)', async function(){
    const response = await request.post('/callback/subscribe').send({
      url: 'https://webhook.site/8e67f026-d8ce-4c6e-8abf-886c26ff5acb',
      API_key: '1cbf9291-3fe3-4182-9486-30eb1afb1589',
    });

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  });

  it('should fail to activate (no account)', async function() {
    const response = await request.post('/callback/activate').send({
      API_key: '1cbf9291-3fe3-4182-9486-30eb1afb1589',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })
})

describe('Has account', () => {
  var API_key = null
  it('should create a new user', async function() {
    const user = await request.post('/signup').send({
      username: 'userName',
      password: '123123123',
    });

    API_key = user.body.API_key
  })

  it('should fail to subscribe (invalid url)', async function(){
    const response = await request.post('/callback/subscribe').send({
      url: 'huha',
      API_key: API_key,
    });

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
  });

  it('should fail to activate (wrong ID)', async function() {
    const response = await request.post('/callback/activate').send({
      URL_id: 'fail_id',
      API_key: API_key,
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })
})
