FROM node:lts

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN apt-get update && \
    apt-get install -y libcurl4

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
