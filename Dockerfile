FROM node:20

WORKDIR /usr/src/app
ADD . .

RUN npm install -g pnpm
RUN pnpm install

RUN apt-get update && \
  apt-get install -y libcurl4
