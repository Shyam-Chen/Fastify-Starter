FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN apt-get update && \
    apt-get install libcurl4

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
