FROM node:18.17.1-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN apt-get update && \
    apt-get install -y curl && \
    curl -L -o caddy.tar.gz https://github.com/caddyserver/caddy/releases/download/v2.7.4/caddy_2.7.4_linux_amd64.tar.gz && \
    tar -xzf caddy.tar.gz && \
    rm -f caddy.tar.gz && \
    mv caddy /usr/bin/caddy && \
    chmod +x /usr/bin/caddy

RUN npm install -g pnpm
RUN pnpm install
