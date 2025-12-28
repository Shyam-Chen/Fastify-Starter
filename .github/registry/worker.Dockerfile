FROM node:24 AS base

WORKDIR /usr/src/app
ADD . .

ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL

ENV COREPACK_INTEGRITY_KEYS="0"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@10.x

RUN pnpm build

FROM node:24

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/app/package.json /usr/src/app/package.json
COPY --from=base /usr/src/app/app/dist /usr/src/app/dist

ENV NODE_ENV=production

ENV COREPACK_INTEGRITY_KEYS="0"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@10.x

USER node
CMD [ "node", "/usr/src/app/dist/worker.js" ]
