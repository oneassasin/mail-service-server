#!/usr/bin/env bash

ssh $SSH_HOST "docker login $REGISTRY_HOST -p $REGISTRY_PASSWORD -u $REGISTRY_LOGIN && docker pull $REGISTRY_HOST/$IMAGE_NAME:latest"

for i in 0 1 2
do
  ssh $SSH_HOST "(docker stop ${IMAGE_NAME}_mail_worker_${i} || true) && (docker rm ${IMAGE_NAME}_mail_worker_${i} || true)"
  ssh $SSH_HOST "docker run -d --name ${IMAGE_NAME}_mail_worker_${i} --restart=always \
    -e NODE_ENV=$NODE_ENV \
    -e DB_URI=$DB_URI \
    -e REDIS_HOST=$REDIS_HOST \
    -e REDIS_PASSWORD=$REDIS_PASSWORD \
    -e INSTANCE_TYPE=mail-worker \
    $DEPLOY_ADDITIONAL_ARGS \
    $REGISTRY_HOST/$IMAGE_NAME"
done

ssh $SSH_HOST "(docker stop ${IMAGE_NAME}_api || true) && (docker rm ${IMAGE_NAME}_api || true)"
ssh $SSH_HOST "docker run -d --name ${IMAGE_NAME}_api --restart=always \
  -e NODE_ENV=$NODE_ENV -p 3004:3000 \
  -e DB_URI=$DB_URI \
  -e REDIS_HOST=$REDIS_HOST \
  -e REDIS_DB=$REDIS_DB \
  -e REDIS_PASSWORD=$REDIS_PASSWORD \
  -e STRAPI_API_TOKEN=$STRAPI_API_TOKEN \
  -e INSTANCE_TYPE=api \
  $DEPLOY_ADDITIONAL_ARGS \
  $REGISTRY_HOST/$IMAGE_NAME"

ssh $SSH_HOST "(docker stop ${IMAGE_NAME}_schedule || true) && (docker rm ${IMAGE_NAME}_schedule || true)"
ssh $SSH_HOST "docker run -d --name ${IMAGE_NAME}_schedule --restart=always \
  -e NODE_ENV=$NODE_ENV \
  -e DB_URI=$DB_URI \
  -e REDIS_HOST=$REDIS_HOST \
  -e REDIS_DB=$REDIS_DB \
  -e REDIS_PASSWORD=$REDIS_PASSWORD \
  -e STRAPI_API_TOKEN=$STRAPI_API_TOKEN \
  -e INSTANCE_TYPE=schedule \
  $DEPLOY_ADDITIONAL_ARGS \
  $REGISTRY_HOST/$IMAGE_NAME"
