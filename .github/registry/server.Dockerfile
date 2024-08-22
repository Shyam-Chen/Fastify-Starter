FROM caddy:2

ARG UPSTREAM_ADDRESS
ENV UPSTREAM_ADDRESS=$UPSTREAM_ADDRESS

COPY --from=base /usr/src/app/.github/registry/Caddyfile /etc/caddy/Caddyfile
