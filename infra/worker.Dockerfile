FROM node:20 as base

WORKDIR /usr/src/app
ADD . .

ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@9

RUN pnpm build

FROM node:20

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/app/package.json /usr/src/app/package.json
COPY --from=base /usr/src/app/app/dist /usr/src/app/dist

ENV NODE_ENV=production

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@9

USER node
CMD [ "node", "/usr/src/app/dist/worker.js" ]
