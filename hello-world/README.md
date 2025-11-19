# Deploy hello-world application to software hub default dataplane

hello-world is an api endpoint that would respond with "hello-world" when invoked from software hub default dataplane

Checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application.

#### deploy using cpd-cli
```
./cpd-cli manage create-dockerfile-application --instance_ns=zen \
	--app_name=hello-world \
	--app_port=8443 \
	--repo_url=https://github.com/IBM/swhub-custom-app-samples.git \
	--repo_token=<ibm github token> \
	--repo_app_dir=hello-world \
	--cpu=400m \
	--memory=200Mi \
	--cpu_limit=500m \
	--memory_limit=400Mi \
	--tls_enabled=true

    command returns application run id
```

* application available at `curl -k https://<zen-route>/physical_location/<default-physical-location-name>/<application-name>-<application-run-id>/hello-world`
