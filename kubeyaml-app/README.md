#### BYOA prequisites
- Install zen
- Create pl
- Assume that the pull secret ` ibm-entitlement-key ` already exists on `mgmt` and `workload namespaces
```bash
{
  "auths": {
    "cp.icr.io": {
      "auth": ""
    },
    "cp.stg.icr.io": {
      "auth": ""
    },
    "docker-na-public.artifactory.swg-devops.com": {
      "auth": ""
    },
    "docker-na.artifactory.swg-devops.com": {
      "auth": ""
    }
  }
}
```
- Enable dataplane and verify code `200` is returned:
```bash
curl -X PUT -sk \
  -H 'Content-Type: application/json' \
  -H "Authorization: ZenApiKey $HUB_API_KEY" \
  "$CPD_URL/zen-data/v1/dataplanes/default-dp" \
  -d '{"enabled": true}'
```
- Assign your created and verify `200` is returned:
```bash
curl -X PATCH -sk \
  -H 'Content-Type: application/json' \
  -H "Authorization: ZenApiKey $HUB_API_KEY" \
  "$CPD_URL/zen-data/v1/dataplanes/default-dp/physical_locations/<pl_name>" \
  -d '{"details":"test"}'
```
#### Kubeyaml app

> All cpd-cli commands will be run from the hub
- Use the `remote-dp-app.tar.gz` in this current workspace
- Run the following command on the hub and observe:
```bash
cpd-cli manage create-kube-yaml-application  --instance_ns=zen  --app_name=kubeyamlsimpleapp --app_tar_file=/tmp/work/remote-dp-app.tar.gz --cpu=10m  --cpu_limit=10m  --memory=10Mi  --memory_limit=100Mi

oc get rkrt 
NAME                             PLACEMENT    FOUND   REMOTECRS    APPLIED   KIND            SAPPLIED   AVAILABLE   TOTAL
kubeyamlsimpleapp-wvioy1zwu308   AsExpected   True    AsExpected   True      ResourceMatch   1          1           1
```
> Note: `--app_name` must be unique
- Check pods are running on the spoke
```bash
oc get po -n workload
NAME                                           READY   STATUS    RESTARTS     AGE
ez-remote-app-nginx-deploy-7745d77888-svsdc    1/1     Running   0            10s
ez-remote-app-pyhttp-deploy-7449c87684-jvqng   1/1     Running   0             9s

```
- Retieve app information specifically the `app_run_id` from the following command
```bash
cpd-cli manage check-custom-application-status  --instance_ns=zen   --app_name=kubeyamlsimpleapp
```
- Create the custom proxy config for app at `/tmp/work/app-proxy-config.yaml`:
```bash
apiVersion: zen.cpd.ibm.com/v1
kind: ZenExtension
metadata:
  name: {{ .serviceName }}
spec:
  upstream.conf: |
    upstream {{ .upstreamName }} {
      keepalive 32;
      keepalive_timeout 30s;
      keepalive_requests 500;
      server ez-remote-app-pyhttp-svc.{{ .dpPhyLocWorkloadNs }}.svc:8080;
    }
  nginx.conf: |
    location ~* /{{ .serviceName }}/(.*) {
      proxy_http_version 1.1;
      proxy_set_header Host $host;
      proxy_set_header Connection "";
      proxy_ssl_server_name on;
      proxy_buffering off;
      proxy_pass https://{{ .upstreamName }}/$1$is_args$args;
      proxy_pass_header X-Accel-Buffering;
    }

cpd-cli manage update-custom-application-proxy-config     --instance_ns=zen     --dataplane_name=default-dp     --app_name=kubeyamlsimpleapp     --app_run_id=mfabg41voj2o     --app_proxy_config_yaml=/tmp/work/app-proxy-config.yaml
```
- Verify the app status specifically `app_status` and `proxy_config_status`:
```bash
Justin@justin-vm1:~/cpd-cli-linux-EE-14.3.0-2597/cpd-cli-workspace/olm-utils-workspace/work$ cpd-cli manage check-custom-application-status  --instance_ns=zen   --app_name=kubeyamlsimpleapp
[INFO] 2026-03-04T13:24:37.445886Z Checking architecture: amd64
[INFO] 2026-03-04T13:24:37.445978Z Checking podman or docker
[INFO] 2026-03-04T13:24:37.530517Z Dockerexe: podman
[INFO] 2026-03-04T13:24:37.530672Z Checking container image: OLM_UTILS_IMAGE = cp.stg.icr.io/cp/cpd/olm-utils-premium-v4:5.4.x
[INFO] 2026-03-04T13:24:37.842631Z Container olm-utils-play-v4 is running already. Image: cp.stg.icr.io/cp/cpd/olm-utils-premium-v4:5.4.x
[INFO] 2026-03-04T13:24:38.021777Z Processing subcommand check-custom-application-status
[INFO] 2026-03-04T13:24:38.022180Z Run command: podman exec -it olm-utils-play-v4 check-custom-application-status --instance_ns=zen --app_name=kubeyamlsimpleapp
[
    {
        "app_name": "kubeyamlsimpleapp",
        "app_port": "8080",
        "app_run_id": "mfabg41voj2o",
        "app_status": "Ready", <- VERIFY
        "app_type": "YamlApp",
        "cpu": "10m",
        "cpu_limit": "10m",
        "dataplane_name": "default-dp",
        "envs": "",
        "envs_from": "",
        "liveness_probe": "",
        "memory": "10Mi",
        "memory_limit": "100Mi",
        "physical_location_name": "<eks-kube-spoke>",
        "proxy_config_status": "RemoteRegistered", <- VERIFY
        "readiness_probe": "",
        "scale": "1"
    }
]
```

- Verify we can reach the kubeapp endpoint from the hub with status code of `200`:
```bash
curl -k  "https://cpd-zen.apps.atlas.cp.fyre.ibm.com/physical_location/<vanilla-pl>/<kubeyamlsimpleapp>-<mfabg41voj2o>/"
```
- The endpoint is the combinatiion of `<app_name>-<app_run_id>`
