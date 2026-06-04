#!/usr/bin/env bash

set -Eeuo pipefail

NAMESPACE="monitoring"

echo "========================================="
echo "Installing kube-prometheus-stack"
echo "========================================="

if ! command -v helm >/dev/null 2>&1; then
  echo "ERROR: helm is not installed"
  exit 1
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "ERROR: kubectl is not installed"
  exit 1
fi

echo
echo "[1/5] Creating namespace..."

kubectl create namespace "$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -

echo
echo "[2/5] Adding Helm repository..."

helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts \
  >/dev/null 2>&1 || true

helm repo update

echo
echo "[3/5] Installing kube-prometheus-stack..."

helm upgrade --install monitoring \
  prometheus-community/kube-prometheus-stack \
  --namespace "$NAMESPACE"

echo
echo "[4/5] Waiting for Grafana..."

kubectl rollout status \
  deployment/monitoring-grafana \
  -n "$NAMESPACE" \
  --timeout=600s

echo
echo "[5/5] Waiting for Prometheus Operator..."

kubectl rollout status \
  deployment/monitoring-kube-prometheus-operator \
  -n "$NAMESPACE" \
  --timeout=600s

echo
echo "========================================="
echo "Monitoring Installed"
echo "========================================="

echo
echo "Monitoring Pods:"
kubectl get pods -n "$NAMESPACE"

echo
echo "Grafana Password:"
kubectl get secret monitoring-grafana \
  -n "$NAMESPACE" \
  -o jsonpath="{.data.admin-password}" \
| base64 -d
