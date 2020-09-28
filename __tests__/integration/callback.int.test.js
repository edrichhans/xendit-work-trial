const supertest = require('supertest');
const request = supertest(spacepackApiApp);
const url = 'https://webhook.site/8e67f026-d8ce-4c6e-8abf-886c26ff5acb'
let API_key = null

describe('Subscribe', function() {
  var urlId = null
  it('should create a new user', async function() {
    const user = await request.post('/signup').send({
      username: 'userName',
      password: '123123123',
    });

    API_key = user.body.API_key
  })

  it('should subscribe successfully', async function() {
    const response = await request.post('/callback/subscribe').send({
      url: url,
      API_key: API_key,
    });

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.URL).toBe(url)
    expect(response.body.status).toBe('pending')
    expect(response.body.test).toBe(true)
    expect(response.body.URL_id).not.toBe(null)
    urlId = response.body.URL_id
  })

  it('should fail to activate', async function() {
    const response = await request.post('/callback/activate').send({
      URL_id: 'fail_id',
      API_key: API_key,
    })

    expect(response.status).toBe(400)
  })

  it('should activate', async function() {
    const response = await request.post('/callback/activate').send({
      URL_id: urlId,
      API_key: API_key,
    })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.test).toBe(false)
  })
})