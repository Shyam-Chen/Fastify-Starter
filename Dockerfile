FROM node:20.11-bullseye-slim

ENV HOME /project

WORKDIR ${HOME}
ADD . $HOME

RUN npm install -g pnpm
RUN pnpm install

RUN apt-get update && \
  apt-get install -y libcurl4
