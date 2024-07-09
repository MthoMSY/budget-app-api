FROM node:20.9-alpine3.17

RUN mkdir /sync
WORKDIR /sync

COPY package.json .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY .env .

RUN yarn install

COPY src ./src

RUN yarn build

EXPOSE 3000

CMD [ "node", "dist/main.js"]