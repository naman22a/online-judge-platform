#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
K8S_DIR="$ROOT_DIR/k8s"

echo "========================================="
echo "Destroying Online Judge Platform"
echo "========================================="

echo
echo "[1/5] Deleting Client"
kubectl delete -f "$K8S_DIR/apps/client/" --ignore-not-found

echo
echo "[2/5] Deleting API Gateway"
kubectl delete -f "$K8S_DIR/apps/api-gateway/" --ignore-not-found

echo
echo "[3/5] Deleting Backend Services"

SERVICES=(
  execution
  submissions
  problems
  companies
  tags
  users
  auth
)

for service in "${SERVICES[@]}"
do
  kubectl delete -f "$K8S_DIR/apps/$service/" --ignore-not-found
done

echo
echo "[4/5] Deleting Infrastructure"

kubectl delete -f "$K8S_DIR/redis/" --ignore-not-found

kubectl delete -f "$K8S_DIR/postgres/postgres-migrate-seed.yml" --ignore-not-found
kubectl delete -f "$K8S_DIR/postgres/postgres-deployment.yml" --ignore-not-found
kubectl delete -f "$K8S_DIR/postgres/postgres-service.yml" --ignore-not-found
kubectl delete -f "$K8S_DIR/postgres/postgres-pvc.yml" --ignore-not-found
kubectl delete -f "$K8S_DIR/postgres/postgres-pv.yml" --ignore-not-found

echo
echo "[5/5] Deleting Secrets/RBAC/Namespace"

kubectl delete -f "$K8S_DIR/secrets.yml" --ignore-not-found
kubectl delete -f "$K8S_DIR/rbac.yaml" --ignore-not-found
kubectl delete -f "$K8S_DIR/namespace.yml" --ignore-not-found

echo
echo "Destroyed."
