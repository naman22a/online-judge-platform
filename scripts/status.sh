#!/usr/bin/env bash

NAMESPACE="oj"

kubectl get pods -o wide -n $NAMESPACE

echo
kubectl get svc -n $NAMESPACE

echo
kubectl get deployments -n $NAMESPACE

echo
kubectl get jobs -n $NAMESPACE

echo
kubectl get events \
  --sort-by=.metadata.creationTimestamp -n $NAMESPACE \
  | tail -20
