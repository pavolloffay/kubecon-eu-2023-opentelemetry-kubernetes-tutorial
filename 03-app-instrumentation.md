# Deploy the application (Severin, Pavol, 30 mins)

This tutorial step focuses on instrumenting the services of the
[sample application](./app).

## Manual instrumentation

As a developer you can add OpenTelemetry to your code by using the
language-specific SDKs.

Here you will only instrument the frontend service manually, we will use
automatic instrumentation for the other services in the next step.

Open the [index.js](./app/frontend/index.js) file with your preferred editor.
Use the instructions provided by the
[official OpenTelemetry documentation](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/)
to add tracing & metrics. A few differences in your implementation:

- Instead of creating a dedicated `tracing.js` you can add the initialization of the SDK at the top of `index.js` directly.
- Replace the `ConsoleSpanExporter` with an `OTLPTraceExporter` as outlined in the [Exporters](https://opentelemetry.io/docs/instrumentation/js/exporters/) documentation (make use of `opentelemetry/exporter-metrics-otlp-grpc` & `opentelemetry/exporter-trace-otlp-grpc`)
- Add a `metricReader` to your SDK initialization:
  
  ```javascript
      ...
      metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
      }),
      ...
  ```

Give it a try yourself, if you are unsure how to accomplish this, you can peek
into the [instrument.js](./app/frontend/instrument.js) file.

Run that application either locally or by rebuilding the underlying container.

If all works, your OpenTelemetry collector should receive metrics & traces and
the logs of the frontend service should contain `trace_id` and `span_id`

Finally, look into the `index.js` file once again, there are a few additional
`TODOs` for you!

## Deploy the application

Run the following command to deploy the sample application to your cluster:

```bash
kubectl apply -f https://github.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/blob/main/app/k8s.yaml
```

After a short while, verify that it has been deployed successfully:

```bash
$ kubectl get all -n tutorial-application
NAME                                       READY   STATUS    RESTARTS   AGE
pod/loadgen-deployment-5cc46c7f8c-6wwrm    1/1     Running   0          39m
pod/backend1-deployment-69bf64db96-nhd98   1/1     Running   0          19m
pod/frontend-deployment-bdbff495f-wc48h    1/1     Running   0          19m
pod/backend2-deployment-856b75d696-d4m6d   1/1     Running   0          19m

NAME                       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/backend1-service   ClusterIP   10.43.194.58   <none>        5000/TCP   39m
service/backend2-service   ClusterIP   10.43.176.21   <none>        5165/TCP   39m
service/frontend-service   ClusterIP   10.43.82.230   <none>        4000/TCP   39m

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/loadgen-deployment    1/1     1            1           39m
deployment.apps/backend1-deployment   1/1     1            1           39m
deployment.apps/frontend-deployment   1/1     1            1           39m
deployment.apps/backend2-deployment   1/1     1            1           39m
```

### Port forward

## Auto-instrumentation

The OpenTelemetry Operator supports injecting and configuring
auto-instrumentation for you.

With the operator & collector running you can now let the Operator know,
what pods to instrument and which auto-instrumentation to use for those pods.
This is done via the Instrumentation CRD. A basic Instrumentation resource
looks like the following:

```yaml
apiVersion: opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: my-instrumentation
  namespace: tutorial-application
spec:
  exporter:
    endpoint: http://otel-collector.observability-backend.svc.cluster.local:4317
```

To create an Instrumentation resource for our sample application run the following
command:

```bash
kubectl apply -f https://raw.githubusercontent.com/pavolloffay/kubecon-eu-2023-opentelemetry-kubernetes-tutorial/main/app/instrumentation.yaml
```

Until now we only have created the Instrumentation resource, in a next step you
need to opt-in your services for auto-instrumentation. This is done by updating
your service's `spec.template.metadata.annotations`

### Instrument Python - backend1 service

```bash
kubectl patch deployment backend1-deployment -n tutorial-application -p '{"spec": {"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-python":"true"}}}} }'
```

Now verify the instrumentation:

```bash
kubectl get pods -n tutorial-application -l app=backend1 -o yaml
```

## Resource attributes

TODO show how Kubernetes resource attributes are collected.

## Sampling

TODO show how sampling is configured. Show that app needs to be restarted.

TODO maybe show Jaeger remote sampler.

## PII

TODO show how to remove PII with processors.
