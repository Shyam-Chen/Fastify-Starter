FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN apt-get update && \
    apt-get install -y libcurl4

RUN npm install -g pnpm caddy-npm
RUN pnpm install --frozen-lockfile
