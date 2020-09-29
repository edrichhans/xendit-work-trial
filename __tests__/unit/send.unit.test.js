const supertest = require('supertest');
const request = supertest(spacepackApiApp);
const sendCallback = require('../../queue/queue').sendCallback
const url = 'https://webhook.site/8e67f026-d8ce-4c6e-8abf-886c26ff5acb'

describe('Send', function(){
  it('should fail to send (invalid API key)', async function(){
    const response = await request.post('/send').send({
      API_key: '1cbf9291-3fe3-4182-9486-30eb1afb1589',
      URL_id: '1234'
    });

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
  });

  it('should be able to send data to the callback url', async function() {
    const response = await sendCallback({
      url: url,
      API_key: '1234',
    })

    expect(response.status).toBe(200)
  })

  it('should be able to send data to the callback url', async function() {
    const response = await sendCallback({
      url: url,
      API_key: '1234',
      payload: JSON.stringify({value: true})
    })

    expect(response.status).toBe(200)
  })
})

describe('Query job status', () => {
  var API_key = null
  it('should create a new user', async function() {
    const user = await request.post('/signup').send({
      username: 'userName',
      password: '123123123',
    });

    API_key = user.body.API_key
  })
  it('should fail to query (invalid API key)', async () => {
    const response = await request.get('/send/status/aaaa')

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
  })

  it('should fail to query (invalid API key)', async () => {
    const response = await request.get(`/send/status/aaaa?API_key=${API_key}`)

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })
})