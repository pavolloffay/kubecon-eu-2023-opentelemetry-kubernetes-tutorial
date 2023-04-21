 # OpenTelemetry Operator Roadmap

### Golang auto-instrumentation.
  - Adding OpenTelemetry instrumentation to Go applications without having to modify their source code.

### OpAMP Bridge.
  - Open Agent Management Protocol (OpAMP) is a network protocol for remote management of large fleets of data collection Agents. The complete specification can be found [here](https://github.com/open-telemetry/opamp-spec/blob/main/specification.md). 

### Simplifying the Operator CRDs.
  - In order to get the OpenTelemetryCollector easier to be deployed, we are experimenting an opinionated CRDs, which will have the cofig file declared as parameters.

### Configuration reload when collector running as Sidecar.
  - When the OpenTelemetryCollector instance is running a sidecar will get reloaded if the config parameter changes.
