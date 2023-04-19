# Metrics

## Summary


## Auto-instrumentation and metrics

TODO show that auto-instrumentation emits some metrics via OTLP.

## Prometheus Target Discovery

#### Service and Pod Monitors

If you have services already generating metrics for prometheus, the collector can collect those using the prometheus 
receiver, which scrapes metric endpoints provided in a scrape_config like the one below:
```yaml
    - job_name: 'otel-collector'
      scrape_interval: 10s
      static_configs:
        - targets: [ '0.0.0.0:8888' ]
```

This solution works but requires writing out all known targets.  When services being deployed are added or changed, 
it will require updating this configuration.  An alternative to this is to set up Prometheus [Service and Pod Monitors](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/design.md#servicemonitor).
This allows for discovering metric endpoint dynamically and without needing to modify the collector configuration and 
restart all collectors.

In order to apply a pod or service monitor, the CRDs need to be installed:
```shell
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml

kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_podmonitors.yaml
```

You can verify both CRDs are present with the command `kubectl get customresourcedefinitions`, and then the below lines 
should be included in your list of CRDs (dates will differ):
```shell
podmonitors.monitoring.coreos.com          2023-04-11T22:17:04Z
servicemonitors.monitoring.coreos.com      2023-04-11T22:16:58Z
```

### Target Allocator

A service called the [Target Allocator](https://github.com/open-telemetry/opentelemetry-operator/blob/main/cmd/otel-allocator/README.md)
can use the prometheus service and pod monitor to discover targets. The Target Allocator discovers the targets and then 
distributes both discovered and configured targets among available collectors. It must be deployed alongside a 
Statefulset of collectors.

Applying this chart will start a new collector as a StatefulSet with the Target Allocator enabled:
```shell
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/03-collector-prom-cr.yaml
```

Applying this chart will set up service monitors for the backend1 service, the target allocators, and the collector statefulset:
```shell
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/04-servicemonitors.yaml
```

## Span metrics

TODO show how OTEL collector can create span RED metrics from spans.

---
[Next Steps](./05-logs.md)
