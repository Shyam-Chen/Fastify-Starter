FROM node:20-bullseye-slim

WORKDIR /usr/src/app
ADD . .

RUN npm install -g pnpm
RUN pnpm install

RUN apt-get update && \
  apt-get install -y libcurl4
