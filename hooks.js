const hooks = require('hooks');

const stash = {};

hooks.after(
  'shorten > /v1/ > Create a shortened URL > 200 > application/json; charset=utf-8',
  t => {
    stash.slug = JSON.parse(t.real.body).slug;
  }
);

hooks.before(
  'shorten > /v1/{slug} > Resolve a slug > 200 > application/json; charset=utf-8',
  t => {
    const paramToAdd = 'noredirect=true';
    let path = t.fullPath.replace('foo-bar', stash.slug);
    if (t.fullPath.indexOf('?') > -1) {
      path += '&' + paramToAdd;
    } else {
      path += '?' + paramToAdd;
    }
    t.fullPath = path;
  }
);
