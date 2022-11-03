FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm
RUN pnpm -v
RUN pnpm install --frozen-lockfile

RUN curl -sS https://webi.sh/caddy | sh
RUN caddy version
