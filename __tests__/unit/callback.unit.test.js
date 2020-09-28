const supertest = require('supertest');
const request = supertest(spacepackApiApp);

describe('Subscribe', function(){
  it('should fail to subscribe', async function(){
    const response = await request.post('/callback/subscribe').send({
      url: 'https://webhook.site/8e67f026-d8ce-4c6e-8abf-886c26ff5acb',
      API_key: '1cbf9291-3fe3-4182-9486-30eb1afb1589',
    });

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  });

  it('should fail to activate', async function() {
    const response = await request.post('/callback/activate').send({
      API_key: '1cbf9291-3fe3-4182-9486-30eb1afb1589',
    })

    expect(response.status).toBe(400)
    expect(response.body.success).toBe(false)
  })
})