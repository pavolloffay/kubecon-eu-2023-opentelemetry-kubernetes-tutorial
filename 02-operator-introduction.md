# OpenTelemetry Operator introduction

This tutorial step focuses on the OpenTelemetry operator introduction.

## Deploy the operator

Deploy OpenTelemetry operator to the cluster:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
sleep 10 # wait until cert-manager is up and ready
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.74.0/opentelemetry-operator.yaml
```

Verify operator installation:

```bash
kubectl get all -n opentelemetry-operator-system
```

## Deploy OpenTelemetry collector

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/02-collector.yaml
```

The collector is by default configured to export data to the observability backed that was deployed in the prerequisites section, however, the configuration can be changed to export data to any OpenTelemetry compatible system.

The data to the collector can be pushed via `otel-collector` service in the `observability-backend` namespace. The full endpoint is `otel-collector.observability-backend.svc.cluster.local:4317`. The collector is by default configured to receive OpenTelemetry protocol OTLP.

## Change collector configuration 

## Crate instrumentation CR

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/app/instrumentation.yaml
```
