# URLShortener

> Public url shortener

[![Build Status](https://travis-ci.com/martolini/urlshortener.svg?branch=master)](https://travis-ci.com/martolini/urlshortener)

Simple url shortener API

## Docs

I would advise you to interact with the API through the cli tool `shorten-cli`.

See https://github.com/martolini/shorten-cli

API Reference: https://urlshortener.surge.sh

## Run locally

`$ yarn #install packages`

`$ yarn test #run tests once`

`$ yarn test:watch #watch tests`

`$ yarn watch #run and restart on changes`

### Environment variables

`BASE_URL` -- Base url that gets returned from `POST /shorten`.

`PORT` -- port that the server is listening to.
