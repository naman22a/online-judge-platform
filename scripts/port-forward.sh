#!/usr/bin/env bash

set -Eeuo pipefail

NAMESPACE="oj"

echo "Starting port forwards..."

echo
echo "API Gateway  -> localhost:5000"
echo "Client       -> localhost:3000"

kubectl port-forward svc/api-gateway 5000:5000 -n $NAMESPACE &
kubectl port-forward svc/client 3000:3000 -n $NAMESPACE &

wait
