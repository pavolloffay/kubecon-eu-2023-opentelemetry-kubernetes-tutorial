# OpenTelemetry Collector introduction (Bene, 10mins)

This tutorial step focuses on OpenTelemetry collector introduction.

## Distributions

There are two collector distributions: "core" and "contrib":

* "core" - https://github.com/open-telemetry/opentelemetry-collector
* "contrib" - https://github.com/open-telemetry/opentelemetry-collector-contrib

## Container registry

Collector images are published to the Github container registry https://github.com/orgs/open-telemetry/packages?repo_name=opentelemetry-collector-releases.

## Run collector locally

```bash
docker run --rm -it -v ${PWD}:/tmp ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector:0.74.0 --config /tmp/collector-config.yaml
```
