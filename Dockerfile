FROM node:20

WORKDIR /usr/src/app
ADD . .

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV MONGOMS_DOWNLOAD_URL=https://repo.mongodb.org/apt/debian/dists/bookworm/mongodb-org/7.0/main/binary-amd64/mongodb-org-server_7.0.8_amd64.deb
ENV MONGOMS_VERSION=7.0.8

RUN pnpm install

RUN apt-get update && \
  apt-get install -y libcurl4
