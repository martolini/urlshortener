FROM node:9-alpine

RUN mkdir /app

ENV PORT 3000

WORKDIR /app

COPY . /app

RUN yarn

ENV NODE_END production

RUN yarn test
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]