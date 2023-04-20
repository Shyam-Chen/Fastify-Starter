FROM node:lts-bullseye-slim

ENV HOME /fastify-starter

WORKDIR ${HOME}
ADD . $HOME

RUN npm install -g pnpm
RUN pnpm install

ENV HOST 0.0.0.0

ARG site_url
ENV SITE_URL=$site_url

ARG mongodb_url
ENV MONGODB_URL=$mongodb_url

ARG redis_url
ENV REDIS_URL=$redis_url

ARG cloudinary_url
ENV CLOUDINARY_URL=$cloudinary_url

ARG smtp_url
ENV SMTP_URL=$smtp_url

ARG secret_key
ENV SECRET_KEY=$secret_key

RUN pnpm build

CMD node index.mjs
