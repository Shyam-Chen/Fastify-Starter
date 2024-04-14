FROM node:20 as base

WORKDIR /usr/src/app
ADD . .

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

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

ENV NODE_ENV=production

USER node
EXPOSE 3000
ENTRYPOINT [ "node", "/usr/src/app/app/dist/main.js" ]
