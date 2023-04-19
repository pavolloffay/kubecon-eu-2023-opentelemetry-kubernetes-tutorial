# OpenTelemetry Operator introduction

This tutorial step focuses on the [OpenTelemetry operator](https://github.com/open-telemetry/opentelemetry-operator) introduction.

## What is Kubernetes operator

Kubernetes operator can:
* Create `CustomResouceDefinitions` (CRD) in the cluster
* Hide deployment complexity of the application
* Support application upgrades (handles breaking changes, schema migrations)
* Auto scale the application

## What is OpenTelemetry operator

OpenTelemetry Kubernetes operator can:
* Deploy and manage OpenTelemetry collector
* Instrument workloads with OpenTelemetry auto-instrumentation/agents (see [app instrumentation tutorial step](./03-app-instrumentation.md)). Supports `Java`, `.Net`, `Node.JS` and `Python`.
* Read Prometheus `podmonitor.monitoring.coreos.com` and `servicemonitor.monitoring.coreos.com` and distribute scrape targets across deployed OpenTelemetry collectors (see [metrics tutorial step](./04-metrics.md))

It manages two `CustomResourceDefinition`s (CRDs):
* `opentelemetrycollectors.opentelemetry.io`, short name `otelcol`
* `instrumentations.opentelemetry.io`, short name `otelinst`

## Deploy the operator

The operator installation consists of the operator `Deployment`, `Service`, `ClusterRole`, `ClusterRoleBinding`, `CustomResourceDefinitions` etc.

The operator can be deployed via:
* [Apply operator Kubernetes manifest files](https://github.com/open-telemetry/opentelemetry-operator/releases)
* [OperatorHub for Kubernetes](https://operatorhub.io/operator/opentelemetry-operator)
* OperatorHub on OpenShift

The default operator installation uses cert-manager to provision certificates for the validating and mutating admission webhooks.

### Deploy the operator to the local Kubernetes cluster

Deploy OpenTelemetry operator to the cluster:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.yaml
sleep 50 # wait until cert-manager is up and ready
kubectl apply -f https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.74.0/opentelemetry-operator.yaml
```

Verify operator installation:

```bash
kubectl get pods -w -n opentelemetry-operator-system
```

## OpenTelemetry collector CRD

Example `OpenTelemetryCollector` CR:

```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: otel
spec:
  mode: deployment # statefulset, daemonset, sidecar
  autoscaler:
    targetCPUUtilization: 90
    minReplicas: 1
    maxReplicas: 5
  ingress:
    hostname: ...
  config: | # contains OpenTelemetry collector configuration
    receivers:
      otlp:
        protocols:
          grpc:
          http:
    processors:
      batch:

    exporters:
      logging:

    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [batch]
          exporters: [logging]
```

The sidecar can be injected to a pod by applying `sidecar.opentelemetry.io/inject: "true"` annotation to a pod spec.

### Deploy collector

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/02-collector.yaml
```

Verify the collector deployment:
```bash
kubectl get pods -n observability-backend -l app.kubernetes.io/component=opentelemetry-collector -w 
```

The collector is by default configured to export data to the observability backed that was deployed in the prerequisites section, however, the configuration can be changed to export data to any [other supported observability system](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter).

The data to the collector can be pushed via `otel-collector` service in the `observability-backend` namespace. The full endpoint is `otel-collector.observability-backend.svc.cluster.local:4317`. The collector is by default configured to receive OpenTelemetry protocol (OTLP).

### Change collector configuration

```bash
kubectl edit opentelemetrycollectors.opentelemetry.io otel -n observability-backend 
```

Let's add Jaeger receiver:

```yaml
    receivers:
      jaeger:
        protocols:
          grpc:
          thrift_binary:
          thrift_compact:
          thrift_http:
        
    service:
      pipelines:
        traces:
          receivers: [otlp, jaeger]
          processors: [memory_limiter, batch]
```

The collector pod should be re-deployed and the `otel-collector` service should expose more ports:

```bash
kubectl get svc otel-collector -n observability-backend -o yaml
NAME                        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                                                             AGE
otel-collector              ClusterIP   10.217.4.201   <none>        14250/TCP,6832/UDP,6831/UDP,14268/TCP,4317/TCP,4318/TCP,55681/TCP   5m15s
otel-collector-headless     ClusterIP   None           <none>        14250/TCP,6832/UDP,6831/UDP,14268/TCP,4317/TCP,4318/TCP,55681/TCP   5m15s
otel-collector-monitoring   ClusterIP   10.217.4.207   <none>        8888/TCP  
```

## Instrumentation CRD

The operator use pod mutating webhook to inject auto-instrumentation libraries into starting pods.
The webhook adds an init container that copies auto-instrumentation libraries into a volume that is mounted as well to the application container and
it configures runtime (e.g. in JVM via `JAVA_TOOL_OPTIONS`) to load the libraries.


Example OpenTelemetry `Instrumentation` CR:

```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: instrumentation
spec:
  exporter:
    endpoint: http://otel-collector:4317
  propagators:
    - tracecontext
    - baggage
    - b3
  sampler:
    type: parentbased_traceidratio
    argument: "1"
  resource:
    addK8sUIDAttributes: true
    attributes: # Add user defined attributes
      env: production
  python:
    env:
      - name: OTEL_EXPORTER_OTLP_ENDPOINT
        value: http://otel-collector:4318
  dotnet:
    env:
      - name: OTEL_EXPORTER_OTLP_ENDPOINT
        value: http://otel-collector:4318
```

Then use annotation on a pod spec to enable the injection e.g. `instrumentation.opentelemetry.io/inject-java: "true"`

We will create the `Instrumentation` resource in the next tutorial step.

---
[Next Steps](./03-app-instrumentation.md)