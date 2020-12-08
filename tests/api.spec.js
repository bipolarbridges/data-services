const jestOpenAPI = require('jest-openapi');
const path = require('path')
const axios = require('axios');
const { fail } = require('assert');

const ax = axios.create({
	baseURL: 'http://127.0.0.1:4010' // mocked service URL
});

jestOpenAPI(path.resolve(process.cwd(), 'reference/bb-api.v0.yaml'));

describe('POST /client', () => {
  it('should satisfy OpenAPI spec', async () => {
    await ax.post('/client',
        {
            id: "client1@email.com"
        }, 
        {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "apikey1"
            }
        })
    .then((res) => {
        expect(res.status).toEqual(201);
        // TODO: why am I doing this? Is the package broken?
        // different version of axios?
        res.request['path'] = '/client';
        res.request['method'] = 'POST';
        expect(res).toSatisfyApiSpec();
    })
    .catch((err) => {
        console.log(err);
        fail()
    })
  });
});

