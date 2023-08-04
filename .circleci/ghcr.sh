echo $GHCR_TOKEN | docker login -u $GHCR_USERNAME --password-stdin ghcr.io

docker build \
  -f Dockerfile \
  --build-arg secret_key=${SECRET_KEY} \
  --build-arg mongodb_uri=${MONGODB_URI} \
  --build-arg sentry_dsn=${SENTRY_DSN} \
  -t $GHCR_NAMESPACE .

docker tag $GHCR_NAMESPACE ghcr.io/$GHCR_NAMESPACE/web
docker push ghcr.io/$GHCR_NAMESPACE/web
