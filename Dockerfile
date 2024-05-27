FROM node:20

WORKDIR /usr/src/app
ADD . .

ENV MONGOMS_VERSION=7.0.11
ENV MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-${MONGOMS_VERSION}.tgz

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@9

RUN apt-get update && \
  apt-get install -y libcurl4
