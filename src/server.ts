import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import randomWords from 'random-words';

const apiRouter = new Router({
  prefix: '/:version',
});

const URL_REGEX_VALIDATOR = /(https?|ftp)(-\.)?([^\s/?\.#-]+\.?)+([^\s]*)?$/;
const SLUG_VALIDATOR = /^[a-z0-9]+-[a-z0-9]+$/;

const shortenings: { [key: string]: string } = {};

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

apiRouter.param('version', async (version, ctx, next) => {
  ctx.state.version = version;
  await next();
});

apiRouter.post('/', ctx => {
  const { url, slug } = ctx.request.body as {
    url?: string;
    slug?: string;
  };
  if (slug && shortenings[slug]) {
    ctx.status = 409;
    ctx.body = {
      message: `${slug} is already taken.`,
    };
    return;
  }

  // Validate URL
  if (!(url && URL_REGEX_VALIDATOR.test(url))) {
    ctx.status = 400;
    ctx.body = {
      message: `Please send a valid URL`,
    };
    return;
  }
  let output = null;
  if (slug) {
    // Validate slug
    if (!SLUG_VALIDATOR.test(slug)) {
      ctx.status = 400;
      ctx.body = {
        message: `${slug} needs to be on the format foo-bar. Examples are cloud-sky, freaky-friday, grumpy-bear.`,
      };
      return;
    }
    shortenings[slug] = url;
    output = slug;
  } else {
    const words = randomWords(2).join('-');
    shortenings[words] = url;
    output = words;
  }
  ctx.body = {
    shortenedUrl: `${BASE_URL}/${ctx.state.version}/${output}`,
    slug: output,
  };
});

apiRouter.get('/lookup', ctx => {
  ctx.body = {
    itemsss: Object.keys(shortenings),
  };
});

apiRouter.get('/:slug', ctx => {
  const short = shortenings[ctx.params.slug];
  if (short) {
    if (ctx.query.noredirect) {
      ctx.body = {
        redirectUrl: short,
      };
      return;
    }
    ctx.redirect(short);
  } else {
    ctx.status = 404;
    ctx.body = {
      message: 'Slug not found',
    };
  }
});

const app = new Koa();

const mainRouter = new Router();

mainRouter.get('/healthz', ctx => {
  ctx.body = {
    success: true,
  };
});

mainRouter.get('/', ctx => {
  ctx.body = {
    versions: {
      v1: '/v1/',
    },
  };
});

app.use(bodyParser());
app.use(mainRouter.routes());
app.use(apiRouter.routes());

export default app;
