FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN npm install -g pnpm
RUN pnpm -v
RUN pnpm install --frozen-lockfile

RUN curl -sS https://webi.sh/caddy | sh
RUN caddy version
