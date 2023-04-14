# KubeCon EU 2023 OpenTelemetry Kubernetes tutorial

__Abstract__:
Deploying an end-to-end observability system comes with many challenges. The organization has to decide how data will be collected, what data formats will be used, sampling strategies, filter sensitive data (a.k.a. PII), and ultimately send data to the observability platform of their choice. In this session, we will teach you how to roll out end-to-end observability data collection on Kubernetes using the OpenTelemetry project. You will learn how to effectively instrument applications using auto-instrumentation, deploy the OpenTelemetry collector, and collect traces, metrics, and logs. You will gain the knowledge needed to tackle the mentioned challenges. After this session, you will be able to understand and use OpenTelemetry instrumentation libraries, collector and Kubernetes operator.

__Schedule__: https://kccnceu2023.sched.com/event/1HyZ3/

__Slides__: https://docs.google.com/presentation/d/1oDpQo9KW_C5HznE0GR53P22HzP_SN2Ml/edit#slide=id.g227fe4440bd_0_0

---

Welcome to the OpenTelemetry Kubernetes tutorial.

Each tutorial step is located in a separate file:

1. [OpenTelemetry Collector introduction](./01-collector-introduction.md)
1. [OpenTelemetry Operator introduction](./02-operator-introduction.md)
1. [Application instrumentation](./03-app-instrumentation.md)
1. [Collecting metrics](./04-metrics.md)
1. [Collecting logs](./05-logs.md)
1. [Roadmap](./06-roadmap.md)

### Prerequisites

This tutorial requires a docker and Kubernetes cluster, refer to [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or [Minikube](https://minikube.sigs.k8s.io/docs/start/) for a local Kubernetes cluster installations.

#### Deploy observability backend

This tutorial uses Grafana Mimir, Loki and Tempo as observability backend to store metrics, logs and traces.

Deploy the backend systems:

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/01-backend.yaml
```

For visualisation port forward Grafana:

```bash
kubectl port-forward -n observability-backend svc/grafana 3000:3000
```

Open it in the browser [localhost:3000](ttp://localhost:3000/)


#### Deploy cert-manager

[cert-manager](https://cert-manager.io/docs/) is used by OpenTelemetry operator to provision TLS certificates for admission webhooks.

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
```
