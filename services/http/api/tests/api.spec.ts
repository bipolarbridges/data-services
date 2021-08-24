/* eslint-disable @typescript-eslint/no-unused-vars */
import jestOpenAPI from 'jest-openapi';
import { resolve } from 'path';
import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import { fail } from 'assert';
import {
  AffirmationBody, AffirmationNotifBody, DomainBody, MeasurementBody,
} from 'main';

const ax = axios.create({
  baseURL: 'http://127.0.0.1:8888',
});

jestOpenAPI(resolve(process.cwd(), 'reference/bb-api.v0.yaml'));

type Method = {
  [key: string]: AxiosInstance['post']
};

const methods: Method = {
  POST: ax.post,
};

function spec(method: string, path: string) {
  return {
    match: (res: AxiosResponse<unknown>) => {
      res.request.path = path;
      res.request.method = method;
      expect(res).toSatisfyApiSpec();
    },
  };
}

function match(method: string, path: string, body: unknown, opts: AxiosRequestConfig, status: number, desc = 'Unspecified') {
  describe(`${method} ${path} [ ${status}: ${desc} ]`, () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const _f_ = methods[method];
    if (!_f_) {
      console.log(`WARNING: invalid method specified ${method}`);
    } else {
      it('Should match API spec', async () => methods[method](`${path}`, body, opts)
        .then((res: AxiosResponse<unknown>) => {
          // Should return the correct status code
          expect(res.status).toEqual(status);
          // Should respond according to the schema
          spec(method, path).match(res);
        })
        .catch((err) => {
          if (!err.response) {
            fail();
          } else {
            const res = err.response;
            expect(res.status).toEqual(status);
            spec(method, path).match(res);
          }
        }));
    }
  });
}

function matchList(method: string, path: string, bodies: unknown[],
  opts: AxiosRequestConfig, status: number, desc = 'Unspecified') {
  bodies.forEach((body) => {
    match(method, path, body, opts, status, desc);
  });
}

describe('Paths', () => {
  describe('/client', () => {
    describe('POST', () => {
      match('POST', '/client',
        {
          id: 'client1@email.com',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 201,
        'Normal happy case');
      match('POST', '/client',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 400,
        'Missing data fields');
      match('POST', '/client',
        "I'm not JSON",
        {
          headers: {
            Authorization: 'apikey1',
          },
        }, 400,
        'Invalid JSON in body');
      match('POST', '/client',
        {
          id: 'client1@email.com',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey2',
          },
        }, 403,
        'Bad key');
      it('Should disallow creation of clients with the same id',
        async () => {
          await ax.post('/client', {
            id: 'client2@email.com',
          }, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'apikey1',
            },
          }).then(async (res) => {
            spec('POST', '/client').match(res);
            expect(res.status).toEqual(201);
            await ax.post('/client', {
              id: 'client2@email.com',
            }, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'apikey1',
              },
            }).then((res2) => {
              fail('Should have rejected');
            }).catch((err) => {
              if (!err.response) {
                fail();
              }
              const res3 = err.response;
              spec('POST', '/client').match(res3);
              expect(res3.status).toEqual(403);
              expect(res3.data.message).toEqual('Already exists');
            });
          }).catch((err: AxiosError) => {
            console.log(err?.response?.data);
            fail();
          });
        });
    });
    describe('GET', () => {
      it('Should reject if no authorization provided', async () => {
        await ax.get('/client/client0@email.com')
          .then(async (res) => {
            fail('Should have rejected');
          })
          .catch((err) => {
            if (!err.response) {
              fail();
            }
          });
      });
    });
  });
  describe('/measurement', () => {
    const validExampleData = {
      clientID: 'client0@email.com',
      data: {
        date: 1610997441,
        name: 'sentiment',
        value: 0.2,
        source: 'measurement',
      },
    };
    describe('POST', () => {
      match('POST', '/measurement',
        {
          clientID: 'doesnotexist@email.com',
          data: validExampleData.data,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 404,
        'Missing client');
      match('POST', '/measurement',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey2',
          },
        }, 403,
        'Bad key case');

      const invalidData: Partial<MeasurementBody>[] = [
        // Missing fields
        {
          // clientID: ...
          data: {
            date: 1610997441,
            name: 'sentiment',
            value: 0.8,
            source: 'measurement',

          },
        },
        {
          clientID: 'client2@email.com',
          // data: ...
        },
        {
          clientID: 'client2@email.com',
          data: {
            // date: ...
            name: 'sentiment',
            value: 0.8,
            source: 'measurement',
          },
        },
        {
          clientID: 'client2@email.com',
          data: {
            date: 1610997441,
            // name: ...
            value: 1.3,
            source: 'measurement',
          },
        },
        {
          clientID: 'client2@email.com',
          data: {
            date: 1610997441,
            name: 'sentiment',
            // value: ...,
            source: 'measurement',
          },
        },
        {
          clientID: 'client2@email.com',
          data: {
            date: 1610997433,
            name: 'sentiment',
            value: 1.3,
            // source: ...
          },
        },
      ];
      matchList('POST', '/measurement', invalidData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 400, 'Data fields are missing or have wrong type');
      const { clientID, data: { source, name, value } } = validExampleData;
      const validData = [
        validExampleData,
        // all have different date
        // different name
        {
          clientID,
          data: {
            date: (new Date()).getTime() + 1000,
            source,
            name: 'mindfulness',
            value,

          },
        },
        // different value
        {
          clientID,
          data: {
            date: (new Date()).getTime() + 2000,
            source,
            name,
            value: 3,
          },
        },
        // different source & name
        {
          clientID,
          data: {
            date: (new Date()).getTime() + 3000,
            source: 'qolSurvey',
            name: 'home',
            value,
          },
        },
        {
          clientID,
          data: {
            date: (new Date()).getTime() + 4000,
            source: 'appleHealth',
            name: 'heartRate',
            value: 80,
          },
        },
      ];
      matchList('POST', '/measurement', validData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 201, 'Normal happy cases');
    });
  });
  describe('/domain', () => {
    describe('POST', () => {
      const validExampleData = {
        id: 'domain1',
        data: {
          bullets: ['example-text'],
          importance: 'very important',
          name: 'exampleName',
          scope: 'all',
        },
      };
      match('POST', '/domain',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 201,
        'Normal happy case');
      match('POST', '/domain',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey2',
          },
        }, 403,
        'Bad key case');
      const invalidDomains: Partial<DomainBody>[] = [
        {
          // id: 'domain-none',
          data: {
            bullets: ['example-text'],
            importance: 'very important',
            name: 'exampleName',
            scope: 'all',
          },
        },
        {
          id: 'domain2',
          // data: {
          //   bullets: [],
          //   importance: '',
          //   name: '',
          //   scope: '',
          // },
        },
        {
          id: 'domain3',
          data: {
            // bullets: [],
            importance: 'very important',
            name: 'exampleName',
            scope: 'all',
          },
        },
        {
          id: 'domain4',
          data: {
            bullets: ['example-text'],
            // importance: '',
            name: 'exampleName',
            scope: 'all',
          },
        },
        {
          id: 'domain5',
          data: {
            bullets: ['example-text'],
            importance: 'very important',
            // name: '',
            scope: 'all',
          },
        },
        {
          id: 'domain6',
          data: {
            bullets: ['example-text'],
            importance: 'very important',
            name: 'exampleName',
            // scope: '',
          },
        },
      ];
      it('Should reject if data fields are missing or have wrong type',
        async () => {
          await Promise.all(invalidDomains.map((dat) => ax.post('/domain', dat, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'apikey1',
            },
          }).then(async (res) => {
            fail(`Should have rejected (${JSON.stringify(dat)})`);
          }).catch((err) => {
            if (!err.response) {
              fail(`Error: ${err}`);
            }
            const res = err.response;
            spec('POST', '/domain').match(res);
            expect(res.status).toEqual(400);
          })));
        });
    });
  });
  describe('/affirmation', () => {
    describe('POST', () => {
      const validExampleData: AffirmationBody = {
        id: 'affirmation1',
        data: {
          content: 'testing content',
          domains: ['domain1'],
          keywords: ['keyword1'],
        },
      };
      match('POST', '/affirmation',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 201,
        'Normal happy case');
      match('POST', '/affirmation',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey2',
          },
        }, 403,
        'Bad key case');
      const invalidData: Partial<AffirmationBody>[] = [

      ];
      matchList('POST', '/affirmation', invalidData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 400, 'Data fields are missing or have wrong type');
    });

    describe('/affirmation/notif', () => {
      const validExampleData: AffirmationNotifBody = {
        id: 'affirmation1',
        data: {
          affirmationId: 'affirmation1',
          userId: 'client1@email.com',
          date: new Date().getTime(),
        },
      };
      match('POST', '/affirmation/notif',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey1',
          },
        }, 201,
        'Normal happy case');
      match('POST', '/affirmation/notif',
        validExampleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'apikey2',
          },
        }, 403,
        'Bad key case');
    });
  });
});
