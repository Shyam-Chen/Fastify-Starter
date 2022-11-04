FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN npm install -g pnpm
RUN pnpm -v
RUN pnpm install --frozen-lockfile

FROM caddy:2-alpine

COPY ./Caddyfile /etc/caddy/Caddyfile

RUN caddy version
