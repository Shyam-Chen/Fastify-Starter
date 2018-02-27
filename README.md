# Kubernetes Engine Starter

:beetle: A boilerplate for Kubernetes, Terraform, Drone, Caddy, Nodemon, PM2, and Babel.

## Getting Started

1. Clone this Boilerplate

```bash
$ git clone --depth 1 https://github.com/Shyam-Chen/Kubernetes-Engine-Starter.git <PROJECT_NAME>
$ cd <PROJECT_NAME>
```

2. Apply a config to a resource

```bash
$ kubectl apply -f k8s
```

3. Display Resources

```bash
$ kubectl get services
# or
$ kubectl get svc
```

```bash
$ kubectl get deployments
# or
$ kubectl get deploy
```

```bash
$ kubectl get pods
# or
$ kubectl get po
```

4. Open the Dashboard

```bash
$ minikube dashboard
```

5. Access the Service

```bash
$ minikube service Kubernetes-Engine-Starter
```
