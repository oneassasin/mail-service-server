FROM node:18.16-alpine as build

RUN mkdir -p /usr/src/app
ADD ./package.json /usr/src/app
ADD ./package-lock.json /usr/src/app

WORKDIR /usr/src/app

RUN npm ci

FROM node:18.16-alpine

COPY --from=build /usr/src/app /usr/src/app

ENV TZ=Europe/Kiev
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm install -g @nestjs/cli

ADD . /usr/src/app

WORKDIR /usr/src/app

ENTRYPOINT npm run start:dev
