# Metrics (Kristina, 15 mins)

## Auto-instrumentation and metrics

TODO show that auto-instrumentation emits some metrics via OTLP.

## Prometheus service/pod monitors

If you have services already generating metrics for prometheus, the collector can collect those using the prometheus 
receiver, which scrapes metric endpoints provided in a scrape_config like the one below:
```yaml
    - job_name: 'otel-collector'
      scrape_interval: 10s
      static_configs:
        - targets: [ '0.0.0.0:8888' ]
```

The collector can be set up with the [Target Allocator](https://github.com/open-telemetry/opentelemetry-operator/blob/main/cmd/otel-allocator/README.md) 
to use prometheus [service and pod monitors](https://github.com/prometheus-operator/prometheus-operator/blob/main/Documentation/design.md#servicemonitor).
This allows the collector to discover metric endpoints dynamically, without listing them all in the scrape configuration.

In order to apply a pod or service monitor, the CRDs need to be installed:
```shell
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_servicemonitors.yaml

kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/example/prometheus-operator-crd/monitoring.coreos.com_podmonitors.yaml
```

Then we can start a new collector as a StatefulSet with a Target Allocator:
```shell
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/03-collector-prom-cr.yaml
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/backend/04-servicemonitors.yaml
```

## Span metrics

TODO show how OTEL collector can create span RED metrics from spans.
