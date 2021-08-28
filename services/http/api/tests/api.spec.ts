/* eslint-disable @typescript-eslint/no-unused-vars */
import jestOpenAPI from 'jest-openapi';
import { resolve } from 'path';
import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse,
} from 'axios';
import { fail } from 'assert';
import {
  AffirmationBody, AffirmationNotifBody, ClientBody, DomainBody, MeasurementBody,
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

type PostMatch = {
  body: unknown,
  opts: AxiosRequestConfig,
  status: number,
  desc?: string,
};

function testPost<T>(path: string, validData: T, invalidData: Partial<T>[],
  extraMatches?: PostMatch[]) {
  const correctHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'apikey1',
    },
  };

  match('POST', path,
    validData,
    correctHeader,
    201,
    'Normal happy case');
  match('POST', path,
    validData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'apikey2',
      },
    }, 403,
    'Bad key case');
  matchList('POST', path,
    invalidData,
    correctHeader,
    400,
    'Data fields are missing or have wrong type');
  extraMatches?.forEach((m) => {
    if (Array.isArray(m.body)) {
      matchList('POST', path, m.body, m.opts, m.status, (m?.desc || 'Unspecified'));
    } else {
      match('POST', path, m.body, m.opts, m.status, (m?.desc || 'Unspecified'));
    }
  });
}

describe('Paths', () => {
  describe('/client', () => {
    describe('POST', () => {
      const validExampleData: ClientBody = {
        id: 'client1@email.com',
      };
      const extraCases: PostMatch[] = [
        {
          body: "I'm not JSON",
          opts: {
            headers: {
              Authorization: 'apikey1',
            },
          },
          status: 400,
          desc: 'Invalid JSON in body',
        },
      ];
      testPost<ClientBody>('/client', validExampleData, [{}], extraCases);
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
    describe('POST', () => {
      const validExampleData: MeasurementBody = {
        clientID: 'client0@email.com',
        data: {
          date: 1610997441,
          name: 'sentiment',
          value: 0.2,
          source: 'measurement',
        },
      };
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
      const otherCases: PostMatch[] = [
        {
          body: {
            clientID: 'doesnotexist@email.com',
            data: validExampleData.data,
          },
          opts: {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'apikey1',
            },
          },
          status: 404,
          desc: 'Missing client',
        },
        {
          body: validData,
          opts: {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'apikey1',
            },
          },
          status: 201,
          desc: 'Normal happy cases',
        },
      ];
      testPost<MeasurementBody>('/measurement', validExampleData, invalidData, otherCases);
    });
  });
  describe('/domain', () => {
    describe('POST', () => {
      const validDomain: DomainBody = {
        id: 'domain1',
        data: {
          bullets: ['example-text'],
          importance: 'very important',
          name: 'exampleName',
          scope: 'all',
        },
      };
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
          // data
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
      testPost<DomainBody>('/domain', validDomain, invalidDomains);
    });
  });
  describe('/affirmation', () => {
    describe('POST', () => {
      const validAffirmation: AffirmationBody = {
        id: 'affirmation1',
        data: {
          content: 'testing content',
          domains: ['domain1'],
          keywords: ['keyword1'],
        },
      };
      const invalidAffirmations: Partial<AffirmationBody>[] = [
        {
          // id: 'affirmation1',
          data: {
            content: 'testing content',
            domains: ['domain1'],
            keywords: ['keyword1'],
          },
        },
        {
          id: 'affirmation1',
          // data
        },
        {
          id: 'affirmation1',
          data: {
            // content: 'testing content',
            domains: ['domain1'],
            keywords: ['keyword1'],
          },
        },
        {
          id: 'affirmation1',
          data: {
            content: 'testing content',
            // domains: ['domain1'],
            keywords: ['keyword1'],
          },
        },
        {
          id: 'affirmation1',
          data: {
            content: 'testing content',
            domains: ['domain1'],
            // keywords: ['keyword1'],
          },
        },
      ];
      testPost<AffirmationBody>('/affirmation', validAffirmation, invalidAffirmations);
    });
  });
  describe('/affirmation/notif', () => {
    describe('POST', () => {
      const validNotif: AffirmationNotifBody = {
        id: 'affirmation1',
        data: {
          affirmationId: 'affirmation1',
          userId: 'client1@email.com',
          date: new Date().getTime(),
        },
      };
      const invalidNotifs: Partial<AffirmationNotifBody>[] = [
        {
          // id: 'affirmation1',
          data: {
            affirmationId: 'affirmation1',
            userId: 'client1@email.com',
            date: new Date().getTime(),
          },
        },
        {
          id: 'affirmation1',
          // data
        },
        {
          id: 'affirmation1',
          data: {
            // affirmationId: 'affirmation1',
            userId: 'client1@email.com',
            date: new Date().getTime(),
          },
        },
        {
          id: 'affirmation1',
          data: {
            affirmationId: 'affirmation1',
            // userId: 'client1@email.com',
            date: new Date().getTime(),
          },
        },
        {
          id: 'affirmation1',
          data: {
            affirmationId: 'affirmation1',
            userId: 'client1@email.com',
            // date: new Date().getTime(),
          },
        },
      ];
      testPost<AffirmationNotifBody>('/affirmation/notif', validNotif, invalidNotifs);
    });
  });
});
