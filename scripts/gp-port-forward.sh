#!/usr/bin/env bash

set -Eeuo pipefail

NAMESPACE="monitoring"

echo "Starting port forwards..."

echo
echo "Grafana      -> localhost:31000"
echo "Prometheus   -> localhost:9090"

kubectl port-forward svc/monitoring-grafana 31000:80 -n $NAMESPACE &
kubectl port-forward svc/monitoring-kube-prometheus-prometheus 9090:9090 -n $NAMESPACE &

wait
