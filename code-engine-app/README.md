# Deploy code engine app to software hub dataplane

[code engine app](code-engine-handson-sample-app) is an example application used for deploying into ibm cloud code engine, the application interacts with ibm cloud object storage service, providing an UI interface for populating bucket created under object storage service. the same application can be deployed into software hub default dataplane as well

- before deploying this sample app, you would need to create object storage service in ibm cloud, create a test bucket and collect the following values:
  ```
  BUCKETNAME : Bucket Name of IBM Object Storage
  COS_ENDPOINT : ENDPOINT of IBM Object Storage, i.e. s3.<your ibm cloud region>.cloud-object-storage.appdomain.cloud
  COS_APIKEY : API Key of IBM Object Storage, this is your ibm cloud api key that has access to object storage service
  COS_RESOURCE_INSTANCE_ID : resource instance ID of IBM Object Storage, you may get the instance id from object store instance CRN, it is the UUID that starts after the last single colon and ends before the final double colon
  TESTVALUE: of anything to write into object store bucket
  ```
- checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application into default dataplane

### Steps to deploy code-engine-app

1. Run `create-dockerfile-application` command inside the cpd-cli binary to deploy the app
2. Run `./cpd-cli manage create-dockerfile-application --help` to know more about other options available.
3. Run the create-dockerfile-application command
    ```
    ./cpd-cli manage create-dockerfile-application \
    --instance_ns=zen \
    --app_name=code-engine-app \
    --app_port=3000 \
    --tls_enabled=false \
    --repo_url=https://github.com/IBM/swhub-custom-app-samples.git \
    --repo_token=<YOUR GITHUB TOKEN>  \
    --repo_app_dir=code-engine-app/code-engine-handson-sample-app \
    --app_envs='[{"name":"BUCKETNAME","value":"<your bucketname in ibm cloud>"},{"name":"TESTVALUE","value":"mytest"},{"name":"COS_ENDPOINT","value":"s3.<your ibm cloud region>.cloud-object-storage.appdomain.cloud"},{"name":"COS_APIKEY","value":"<your ibm api key>"},{"name":"COS_RESOURCE_INSTANCE_ID","value":"<your cos resource instance id>"},{"name":"HOME", "value":"/tmp"}]' \
    --cpu=400m \
    --memory=200Mi \
    --cpu_limit=500m \
    --memory_limit=400Mi
    ```
4. If you see this error in step 5 `-build` pod
    ```
    Defaulted container "docker-build" out of: docker-build, git-clone (init), manage-dockerfile (init)
    time="2025-10-30T23:58:57Z" level=info msg="Not using native diff for overlay, this may cause degraded performance for building images: kernel has CONFIG_OVERLAY_FS_REDIRECT_DIR enabled"
    I1030 23:58:57.938443       1 defaults.go:112] Defaulting to storage driver "overlay" with options [mountopt=metacopy=on].
    Caching blobs under "/var/cache/blobs".

    Pulling image node:17.4 ...
    Resolving "node" using unqualified-search registries (/var/run/configs/openshift.io/build-system/registries.conf)
    Trying to pull registry.redhat.io/node:17.4...
    Trying to pull registry.access.redhat.com/node:17.4...
    Trying to pull quay.io/node:17.4...
    Trying to pull docker.io/library/node:17.4...
    time="2025-10-30T23:59:31Z" level=warning msg="Failed, retrying in 1s ... (1/3). Error: initializing source docker://node:17.4: reading manifest 17.4 in docker.io/library/node: toomanyrequests: You have reached your unauthenticated pull rate limit. https://www.docker.com/increase-rate-limit"`
    ```

    Path the `pull-secret` with public docker username and password  
      ```
      # DOCKER_CONFIG=$(echo -n 'username:password' | base64 -w0)
      oc set data secret/pull-secret -n openshift-config --from-literal=.dockerconfigjson="{\"auths\":{\"docker.io\":{\"auth\":\"$DOCKER_CONFIG\"}}}"
      secret/pull-secret data updated
      ```

5. check pods in workload namespace

    ```
    # oc get po -n wl
    NAME                                              READY   STATUS      RESTARTS   AGE
    final-code-engine-app-j5itik3ikksx-1-build            0/1     Completed   0          6m32s
    final-code-engine-app-j5itik3ikksx-5f79744d79-75gpk   1/1     Running     0          3m49s
    ```  

6. update application proxy config - copy `code-engine-app.conf.yaml` in this folder to `cpd-cli-workspace/olm-utils-workspace/work/`  
    ```
    ./cpd-cli manage update-custom-application-proxy-config \
    --instance_ns=zen \
    --app_name=code-engine-app \
    --app_run_id=<from create-dockerfile-application> \
    --app_proxy_config_yaml=/tmp/work/code-engine-app.conf.yaml
    ```

7. Check the application running at `https://zen-route/physical_location/<default pl name>/<app_name>-<app_run_id>/`
