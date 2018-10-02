import test from 'ava';
import request from 'supertest';
import server from './server';

const url = 'https://foo.bar';

test('shorten url', async t => {
  const response = await request(server.callback())
    .get('/v1')
    .send({ url });
  t.truthy(response.body);
});

test('Pass in slugs', async t => {
  const slug = 'foo-bar';
  t.is(
    (await request(server.callback())
      .post('/v1')
      .send({ url, slug })).status,
    200
  );

  const response = await request(server.callback())
    .post('/v1')
    .send({ url, slug });
  t.is(response.status, 409);
});

test('Test a slug', async t => {
  const slug = 'foo-bar';
  await request(server.callback())
    .post('/v1')
    .send({ url, slug });
  t.is((await request(server.callback()).get('/v1/foo-bar')).status, 302);
});

test('Check health', async t => {
  const response = await request(server.callback()).get('/healthz');
  t.is(response.body.success, true);
});

test('Lookup', async t => {
  const response = await request(server.callback()).get('/v1/lookup');
  t.deepEqual(response.body.items, ['foo-bar']);
});
