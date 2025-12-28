FROM node:24 AS base

WORKDIR /usr/src/app
ADD . .

ENV HOST=0.0.0.0

ARG PORT
ENV PORT=$PORT

ARG SITE_URL
ENV SITE_URL=$SITE_URL

ARG MONGODB_URL
ENV MONGODB_URL=$MONGODB_URL

ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL

ARG CLOUDINARY_URL
ENV CLOUDINARY_URL=$CLOUDINARY_URL

ARG SMTP_URL
ENV SMTP_URL=$SMTP_URL

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY

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

ARG PORT
ENV PORT=$PORT

ENV COREPACK_INTEGRITY_KEYS="0"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack use pnpm@10.x

USER node
EXPOSE ${PORT}
ENTRYPOINT [ "node" ]
CMD [ "/usr/src/app/dist/main.js" ]
