# OpenTelemetry Operator introduction (Pavol)

This tutorial step focuses on the OpenTelemetry operator introduction.

## What is OpenTelemetry operator

TODO

## Deploy the operator

The operator installation consists of the operator Deployment, Service, ClusterRole, ClusterRoleBinding, CRDs etc.

The operator can be deployed via:
* [Apply operator Kubernetes manifest files](https://github.com/open-telemetry/opentelemetry-operator/releases/download/v0.74.0/opentelemetry-operator.yaml)
* [OperatorHub for Kubernetes](https://operatorhub.io/operator/opentelemetry-operator)
* OperatorHub on OpenShift

### Deploy the operator to the local Kubernetes cluster

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

The collector is by default configured to export data to the observability backed that was deployed in the prerequisites section, however, the configuration can be changed to export data to any [other supported observability system](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/main/exporter).

The data to the collector can be pushed via `otel-collector` service in the `observability-backend` namespace. The full endpoint is `otel-collector.observability-backend.svc.cluster.local:4317`. The collector is by default configured to receive OpenTelemetry protocol (OTLP).

### Change collector configuration

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
kubectl get svc -n observability-backend                                                                                                                                                      ploffay@fedora
NAME                        TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                                                             AGE
otel-collector              ClusterIP   10.217.4.201   <none>        14250/TCP,6832/UDP,6831/UDP,14268/TCP,4317/TCP,4318/TCP,55681/TCP   5m15s
otel-collector-headless     ClusterIP   None           <none>        14250/TCP,6832/UDP,6831/UDP,14268/TCP,4317/TCP,4318/TCP,55681/TCP   5m15s
otel-collector-monitoring   ClusterIP   10.217.4.207   <none>        8888/TCP  
```

## Create instrumentation CR

Now let's create an Instrumentation CR that defines configuration for OpenTelemetry auto-instrumentation agents.

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/app/instrumentation.yaml
```

