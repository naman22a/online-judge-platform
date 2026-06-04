#!/usr/bin/env bash

set -Eeuo pipefail

NAMESPACE="oj"

DEPLOYMENTS=(
  auth-deployment
  users-deployment
  tags-deployment
  companies-deployment
  problems-deployment
  submissions-deployment
  execution-deployment
  api-gateway-deployment
  client-deployment
)

echo "Restarting deployments..."

for deployment in "${DEPLOYMENTS[@]}"
do
  echo "Restarting $deployment"
  kubectl rollout restart deployment/"$deployment" -n $NAMESPACE
done

echo
echo "Waiting for rollouts..."

for deployment in "${DEPLOYMENTS[@]}"
do
  kubectl rollout status deployment/"$deployment" --timeout=300s -n $NAMESPACE
done

echo
echo "All deployments restarted successfully."
