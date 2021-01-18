const jestOpenAPI = require('jest-openapi');
const path = require('path')
const axios = require('axios');
const { fail } = require('assert');

const ax = axios.create({
	baseURL: "http://127.0.0.1:8888"
});

jestOpenAPI(path.resolve(process.cwd(), "reference/bb-api.v0.yaml"));

const methods = {
    "POST": ax.post
};

function spec
(method, path) {
    return {
        match: (res) => {
            // TODO: why am I doing this? Is the package broken?
            // different version of axios?
            res.request['path'] = path;
            res.request['method'] = method;
            expect(res).toSatisfyApiSpec();
        }
    }
}

function match
(method, path, body, opts, status, desc = "Unspecified") {
    describe(`${method} ${path} [ ${status}: ${desc} ]`, () => {
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
                spec(method, path).match(res)
            })
            .catch((err) => {
                if (!err['response']) {
                    console.log(err)
                    fail()
                } else {
                    const res = err['response']
                    expect(res.status).toEqual(status);
                    spec(method, path).match(res);
                }
            }));
        }
      });
}


describe("Paths", () => {
    describe("/client", () => {
        match("POST", "/client",
            {
                id: "client1@email.com"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "apikey1"
                }
            }, 201,
            "Normal happy case");
        match("POST", "/client",
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "apikey1"
                }
            }, 400,
            "Missing data fields");
        match("POST", "/client",
            "I'm not JSON",
            {
                headers: {
                    "Authorization": "apikey1"
                }
            }, 400,
            "Invalid JSON in body");
        match("POST", "/client",
            {
                id: "client1@email.com"
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "apikey2"
                }
            }, 403,
            "Bad key");
        it.only("Should disallow creation of clients with the same id", 
            async () => {
                await ax.post("/client", {
                    id: "client2@email.com"
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "apikey1"
                    }
                }).then(async (res) => {
                    spec("POST", "/client").match(res)
                    expect(res.status).toEqual(201)
                    await ax.post("/client", {
                        id: "client2@email.com"
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "apikey1"
                        }
                    }).then((res) => {
                        fail("Should have rejected")
                    }).catch((err) => {
                        if (!err['response']) {
                            fail()
                        }
                        const res = err['response']
                        spec("POST", "/client").match(res)
                        expect(res.status).toEqual(403)
                        console.log(res)
                    })
                }).catch((err) => {
                    console.log(err)
                    fail()
                })
            })
    });
});
