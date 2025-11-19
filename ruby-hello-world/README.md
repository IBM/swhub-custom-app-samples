# Deploy ruby-hello-world application to software hub default dataplane

ruby-hello-world is a web UI application that demostrates openshift template, the application can be deployed into software hub default dataplane as an template application

Checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application.

### Steps to deploy ruby-hello-world

1. Run this command to change the directory to work directory inside cpd-cli binary `cd cpd-cli-workspace/olm-utils-workspace/work/`
2. Create a file `<file_name>.yaml`
3. Copy the contents of `application-template-stibuil.yaml` and paste in the file created in step 2.
4. RUN `tar -cvzf <file_name>.tar.gz <file_name>.yaml`
5. change the directory back to cpd-cli: `cd ../../..`
6. Run `./cpd-cli manage create-oc-template-application --help` to know more about other options available.
7. Run the create template application command:

```
./cpd-cli manage create-oc-template-application --instance_ns=zen --app_name=ruby-hello-world --app_tar_file=/tmp/work/<file_name>.tar.gz from step 4>  --cpu=400m --memory=200Mi --cpu_limit=500m --memory_limit=400Mi
```

8. Check the pods in workload namespace

```
oc get po
NAME                                                              READY   STATUS      RESTARTS   AGE
database-75bff5c968-bjkx8                                         1/1     Running     0          31m
frontend-c5c765c45-g99fm                                          1/1     Running     0          30m
frontend-c5c765c45-gtbx2                                          1/1     Running     0          30m
```

9. Update the app proxy config - copy `ruby-hello-world.conf.yaml` to `cpd-cli-workspace/olm-utils-workspace/work/`
```
./cpd-cli manage update-custom-application-proxy-config \
--instance_ns=zen \
--app_name=ruby-hello-world \
--app_run_id=<from create-oc-template-application> \
--app_proxy_config_yaml=/tmp/work/ruby-hello-world.conf.yaml
```

10. Check the application running at: `https://<zen-route>/physical_location/<default-physical-location-name>/<application-name>-<application-run-id>/frontend/`
