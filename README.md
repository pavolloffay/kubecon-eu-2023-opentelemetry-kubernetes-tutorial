# KubeCon EU 2023 OpenTelemetry Kubernetes tutorial

Abstract:
Deploying an end-to-end observability system comes with many challenges. The organization has to decide how data will be collected, what data formats will be used, sampling strategies, filter sensitive data (a.k.a. PII), and ultimately send data to the observability platform of their choice. In this session, we will teach you how to roll out end-to-end observability data collection on Kubernetes using the OpenTelemetry project. You will learn how to effectively instrument applications using auto-instrumentation, deploy the OpenTelemetry collector, and collect traces, metrics, and logs. You will gain the knowledge needed to tackle the mentioned challenges. After this session, you will be able to understand and use OpenTelemetry instrumentation libraries, collector and Kubernetes operator.

Schedule: https://kccnceu2023.sched.com/event/1HyZ3/

Slides: https://docs.google.com/presentation/d/1oDpQo9KW_C5HznE0GR53P22HzP_SN2Ml/edit#slide=id.g227fe4440bd_0_0

---

Welcome to the OpenTelemetry Kubernetes tutorial.

### Prerequisites

This tutorial requires a Kubernetes cluster, refer to [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or [Minikube](https://minikube.sigs.k8s.io/docs/start/) for a local Kubernetes cluster installations.

#### Installing dependencies

Install cert-manager (required by operator webhook) and OpenTelemetry operator:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
sleep 10
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.74.0/opentelemetry-operator.yaml
```

#### Deploy observability backend

This tutorial uses Grafana Mimir, Loki and Tempo as observability backend to store metrics, logs and traces.

After installing the observability backend OTLP metrics, logs and traces can be sent to the OpenTelemetry collector available at `otel-collector.observability-backend.svc.cluster.local:4317`.

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/backend.yaml
```

For visualisation port forward Grafana:

```bash
kubectl port-forward -n observability-backend svc/grafana 3000:3000
```
