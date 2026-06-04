#!/usr/bin/env bash

set -Eeuo pipefail

helm uninstall monitoring -n monitoring

kubectl delete namespace monitoring
