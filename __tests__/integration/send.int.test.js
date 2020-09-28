const supertest = require('supertest');
const request = supertest(spacepackApiApp);
const url = 'https://webhook.site/8e67f026-d8ce-4c6e-8abf-886c26ff5acb'
var queue = require('../../queue/queue')

describe('Send', function(){
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

  it('should fail to send the test notification (no user)', async function() {
    const response = await request.post('/send').send({
      URL_id: urlId,
      payload: JSON.stringify({integration: true})
    })

    expect(response.body.message).toBe('User not found.')
    expect(response.body.success).toBe(false)
    expect(response.status).toBe(400)
  })

  it('should be able to send test notification', async function() {
    const response = await request.post('/send').send({
      API_key: API_key,
      URL_id: urlId,
      payload: JSON.stringify({integration: true})
    })

    expect(response.body.message).toBe('Message added to queue')
    expect(response.body.success).toBe(true)
    expect(response.status).toBe(200)
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

  it('should be able to send non-test notification', async function() {
    const response = await request.post('/send').send({
      API_key: API_key,
      URL_id: urlId,
      payload: JSON.stringify({integration: true})
    })

    expect(response.body.message).toBe('Message added to queue')
    expect(response.body.success).toBe(true)
    expect(response.status).toBe(200)
  })
})

describe('Retry', function() {
  var fakeUrlId = null
  it('should subscribe successfully', async function() {
    const response = await request.post('/callback/subscribe').send({
      url: 'thisshouldnotwork.aaa',
      API_key: API_key,
    });

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.URL).toBe('thisshouldnotwork.aaa')
    expect(response.body.status).toBe('pending')
    expect(response.body.test).toBe(true)
    expect(response.body.URL_id).not.toBe(null)
    fakeUrlId = response.body.URL_id
  })

  it('should add the message to the queue', async function() {
    const response = await request.post('/send').send({
      API_key: API_key,
      URL_id: fakeUrlId,
      payload: JSON.stringify({integration: true})
    })

    expect(response.body.message).toBe('Message added to queue')
    expect(response.status).toBe(200)
  })
})
