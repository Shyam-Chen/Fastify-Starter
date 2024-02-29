FROM node:20.11-bullseye-slim

ENV HOME /app

WORKDIR ${HOME}
ADD ./app $HOME

RUN npm install -g pnpm
RUN pnpm install

RUN apt-get update && \
  apt-get install -y libcurl4
