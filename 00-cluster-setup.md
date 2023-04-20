# Cluster setup

This tutorial requires a docker and Kubernetes cluster, refer to [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/) or [Minikube](https://minikube.sigs.k8s.io/docs/start/) for a local Kubernetes cluster installations.

## Quickstart

### Kubectl

Almost all of the following steps in this tutorial require kubectl. Your used version should not differ more than +-1 from the used cluster version. Please follow [this](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-kubectl-binary-with-curl-on-linux) installation guide.

### Kind

If [go](https://go.dev/) is installed on your machine, `kind` can be easily installed as follows:

```bash
go install sigs.k8s.io/kind@v0.18.0
```

If this is not the case, simply download the [kind-v0.18.0](https://github.com/kubernetes-sigs/kind/releases/tag/v0.18.0) binary from the release page. (Other versions will probably work too. :cowboy_hat_face:)

### Create a workshop cluster

After a successful installation, a cluster can be created as follows:

```bash
kind create cluster --name=workshop --image kindest/node:v1.26.3
```

Kind automatically sets the kube context to the created workshop cluster. We can easily check this by getting information about our nodes.

```bash
kubectl get nodes
```
Expected is the following:

```bash
NAME                     STATUS   ROLES           AGE   VERSION
workshop-control-plane   Ready    control-plane   75s   v1.26.3
```

### Cleanup

```bash
kind delete cluster --name=workshop
```

### Telemetrygen (optional)

To send telemetry to the OpenTelemetry Collector (that will be created in step 1), there is a `telemetrygen` helper tool [in the contrib repository avaliable](https://github.com/open-telemetry/opentelemetry-collector-contrib/tree/v0.75.0/cmd/telemetrygen). If go is not installed, the container image can be used.

```bash
go install github.com/open-telemetry/opentelemetry-collector-contrib/cmd/telemetrygen@v0.75.0
```

---
[Next steps](./01-collector-introduction.md)
