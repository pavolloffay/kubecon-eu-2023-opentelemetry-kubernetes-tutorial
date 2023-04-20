 # OpenTelemetry Operator Roadmap

### Golang auto-instrumentation.
  - Adding OpenTelemetry instrumentation to Go applications without having to modify their source code.

### OpAMP Bridge.
  - Open Agent Management Protocol (OpAMP) is a network protocol for remote management of large fleets of data collection Agents. The complete specification can be found [here](https://github.com/open-telemetry/opamp-spec/blob/main/specification.md). 

### Simplifying the Operator CRDs.
````yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollectorDestination
metadata:
  name: dst1
spec:
  processor:
    batch:
      ...
    resourcedetection/test:
      detector:
        ...
  exporter:
    ...
---
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollectorMetrics
metadata:
  name: something
spec:
  replicas: 2
  destination:
    - dst1
   prometheusCR:
    serviceMonitorSelector:
      abc: def
   static_configs: ...
````

### Configuration reload when collector running as Sidecar.
