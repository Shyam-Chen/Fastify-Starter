FROM node:20 as base

WORKDIR /usr/src/app
ADD . .

ENV HOST 0.0.0.0

ARG site_url
ENV SITE_URL=$site_url

ARG MONGODB_URL
ENV MONGODB_URL=$MONGODB_URL

ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL

ARG CLOUDINARY_URL
ENV CLOUDINARY_URL=$CLOUDINARY_URL

ARG SMTP_URL
ENV SMTP_URL=$SMTP_URL

ARG SECRET_KEY
ENV SECRET_KEY=$SECRET_KEY

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm install
RUN pnpm build

FROM node:20

WORKDIR /usr/src/app

COPY --from=base /usr/src/app/app/package.json /usr/src/app/package.json
COPY --from=base /usr/src/app/app/dist /usr/src/app/dist

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV NODE_ENV=production

RUN pnpm install

USER node
EXPOSE 3000
CMD [ "node", "/usr/src/app/dist/main.js" ]
