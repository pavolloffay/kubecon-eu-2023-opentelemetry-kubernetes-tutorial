# Logs

## Summary

As far logs are concerned, one of the many challenges of SRE's is standardize the how the logs flow from diverse applications to different logging solutions, due to that, OpenTelemetry has the ability to receive and transmit logs through the OTEL protocol and create a correlation (e.g. through origin of the telemetry, execution context, time of execution) with metrics and traces.

## FileLog receiver
Filelog receiver is one of the various Receivers available on [OpenTelemetry Collector Contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib). It can read.

## Otel Collector running as DaemonSet

In order to demonstrate the logs instrumentation, we have to get the OpenTelemetry Instance running as a Daemonset:

````yaml
apiVersion: opentelemetry.io/v1alpha1
kind: OpenTelemetryCollector
metadata:
  name: otel-collector
  namespace: observability-backend
spec:
  mode: daemonset
  image: ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib:0.74.0
  config: |
    receivers:
      otlp:
        protocols:
          grpc:
          http:
      prometheus:
        config:
          scrape_configs:
            - job_name: 'otel-collector'
              scrape_interval: 10s
              static_configs:
                - targets: [ '0.0.0.0:8888' ]

      filelog:
        include:
          - /var/log/pods/*/*/*.log
        exclude:
          # Exclude logs from all containers named otel-collector
          - /var/log/pods/*/otel-collector/*.log
        start_at: beginning
        include_file_path: true
        include_file_name: false
        operators:
          # Find out which format is used by kubernetes
          - type: router
            id: get-format
            routes:
              - output: parser-docker
                expr: 'body matches "^\\{"'
              - output: parser-crio
                expr: 'body matches "^[^ Z]+ "'
              - output: parser-containerd
                expr: 'body matches "^[^ Z]+Z"'
          # Parse CRI-O format
          - type: regex_parser
            id: parser-crio
            regex: '^(?P<time>[^ Z]+) (?P<stream>stdout|stderr) (?P<logtag>[^ ]*) ?(?P<log>.*)$'
            output: extract_metadata_from_filepath
            timestamp:
              parse_from: attributes.time
              layout_type: gotime
              layout: '2006-01-02T15:04:05.999999999Z07:00'
          # Parse CRI-Containerd format
          - type: regex_parser
            id: parser-containerd
            regex: '^(?P<time>[^ ^Z]+Z) (?P<stream>stdout|stderr) (?P<logtag>[^ ]*) ?(?P<log>.*)$'
            output: extract_metadata_from_filepath
            timestamp:
              parse_from: attributes.time
              layout: '%Y-%m-%dT%H:%M:%S.%LZ'
          # Parse Docker format
          - type: json_parser
            id: parser-docker
            output: extract_metadata_from_filepath
            timestamp:
              parse_from: attributes.time
              layout: '%Y-%m-%dT%H:%M:%S.%LZ'
          - type: move
            from: attributes.log
            to: body
          # Extract metadata from file path
          - type: regex_parser
            id: extract_metadata_from_filepath
            regex: '^.*\/(?P<namespace>[^_]+)_(?P<pod_name>[^_]+)_(?P<uid>[a-f0-9\-]{36})\/(?P<container_name>[^\._]+)\/(?P<restart_count>\d+)\.log$'
            parse_from: attributes["log.file.path"]
          # Rename attributes
          - type: move
            from: attributes.stream
            to: attributes["log.iostream"]
          - type: move
            from: attributes.container_name
            to: resource["k8s.container.name"]
          - type: move
            from: attributes.namespace
            to: resource["k8s.namespace.name"]
          - type: move
            from: attributes.pod_name
            to: resource["k8s.pod.name"]
          - type: move
            from: attributes.restart_count
            to: resource["k8s.container.restart_count"]
          - type: move
            from: attributes.uid
            to: resource["k8s.pod.uid"]
    
    processors:
      attributes:
        actions:
         - action: insert
           key: log_file_name
           from_attribute: log.file.name
         - action: insert
           key: loki.attribute.labels
           value: log_file_name
      batch:
      memory_limiter:
        check_interval: 1s
        limit_percentage: 50
        spike_limit_percentage: 30
    
    exporters:
      logging:
      
      loki:
        endpoint: "http://loki.observability-backend.svc.cluster.local:3100/loki/api/v1/push"

    service: 
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [logging]
        metrics:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [logging]
        logs:
          receivers: [otlp, filelog]
          processors: [attributes,memory_limiter, batch ]
          exporters: [logging, loki]

````
