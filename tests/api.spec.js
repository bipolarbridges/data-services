const jestOpenAPI = require('jest-openapi');
const path = require('path')
const axios = require('axios');
const { fail } = require('assert');

const ax = axios.create({
	baseURL: "http://127.0.0.1:4010" // mocked service URL
});

jestOpenAPI(path.resolve(process.cwd(), "reference/bb-api.v0.yaml"));

const methods = {
    "POST": ax.post
};

const match = (method, path, body, opts, status) => {
    describe(`${method} ${path}`, () => {
        const _f_ = methods[method]
        if (!_f_) {
            console.log(`WARNING: invalid method specified ${method}`)
        } else {
            it("Should match API spec", async () =>
            await methods[method](`${path}`, body, opts)
            .then((res) => {
                // Should return the correct status code
                    expect(res.status).toEqual(status);
                // Should respond according to the schema
                    // TODO: why am I doing this? Is the package broken?
                    // different version of axios?
                    res.request['path'] = path;
                    res.request['method'] = method;
                    expect(res).toSatisfyApiSpec();
            })
            .catch((err) => {
                console.log(err);
                fail()
            }));
        }
      });
}

match("POST", "/client",
    {
        id: "client1@email.com"
    }, 
    {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "apikey1"
        }
    }, 201);

