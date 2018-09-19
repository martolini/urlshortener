import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import randomWords from 'random-words';

const router = new Router();

const shortenings: { [key: string]: string } = {};

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

router.get('/', ctx => {
  ctx.body = {
    message:
      'Welcome. Do a get request to /shorten?url=<url> to shorten a url.',
  };
});

router.get('/shorten', ctx => {
  const { url = '', slug } = ctx.query as { url: string; slug: any };
  if (slug && shortenings[slug]) {
    ctx.status = 409;
    ctx.body = {
      message: `${slug} is already taken.`,
    };
    return;
  }
  let output = null;
  if (slug) {
    shortenings[slug] = url;
    output = slug;
  } else {
    const words = randomWords(2).join('-');
    shortenings[words] = url;
    output = words;
  }
  ctx.body = {
    shortenedUrl: `${BASE_URL}/${output}`,
    slug: output,
  };
});

router.get('/healthz', ctx => {
  ctx.body = {
    success: true,
  };
});

router.get('/:slug', ctx => {
  const short = shortenings[ctx.params.slug];
  if (short) {
    ctx.redirect(short);
  } else {
    ctx.status = 404;
  }
});

const app = new Koa();

app.use(bodyParser());

app.use(router.routes());

export default app;
