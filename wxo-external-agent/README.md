# Deploy wxo adk external-agent to software hub dataplane

[Wxo External Agent](watsonx-orchestrate-developer-toolkit/external_agent/examples/langgraph_python/README.md) is an example app that provides chat completions api that can be used as an external agent in watson orchestrate, it interacts with ai service endpoints hosted on ibm cloud watsonx service. app is cloned from [here](https://github.com/watson-developer-cloud/watsonx-orchestrate-developer-toolkit/tree/main/external_agent/examples/langgraph_python)

this is the instruction doc for deploying the app into software hub default dataplane:  
- you need to have watsonx ai service/assets deployment in ibm cloud (refer to watsonx.ai documentation), you would need to collect:
  - WATSONX_SPACE_ID: your ibm cloud deployment space for your ai service deployment
  - WATSONX_API_KEY: your ibm cloud api key that has access to watsonx runtime service

- checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application into default dataplane  

#### Steps to deploy ruby-hello-world  
1. Change to the work directory inside the cpd-cli binary:
    ```
    cd cpd-cli-workspace/olm-utils-workspace/work/
    ```

2. Create a new YAML file:
    ```
    touch app-proxy-config.yaml
    ```
3. Copy the contents from the provided file in this folder and paste them into app-proxy-config.yaml.
4. Go back to the cpd-cli directory:
    ```
    cd ../../..
    ```
5. Run the create-dockerfile-application command:
    ```
    ./cpd-cli manage create-dockerfile-application --instance_ns=zen --app_name=wxo-external-agent --app_port=8080 --app_port_tls=false  --repo_url=https://github.com/IBM/swhub-custom-app-samples.git --repo_token=<YOUR GITHUB TOKEN> --repo_branch=main --repo_app_dir=wxo-external-agent/watsonx-orchestrate-developer-toolkit/external_agent/examples/langgraph_python --app_envs='[{"name":"WATSONX_SPACE_ID","value":"<your ibm cloud watsonx deployment space id>"},{"name":"WATSONX_API_KEY","value":"<your ibm cloud api key for watsonx runtime>"}]' --app_proxy_config_yaml='/tmp/work/app-proxy-config.yaml' --cpu=400m --memory=200Mi --cpu_limit=500m --memory_limit=400Mi
    ```
6. Check the pods in workload namespace  
    ```
    oc get po -n wl | grep external-agent
    wxo-external-agent-h4yc75nkwi2w-1-build                               0/1     Completed   0          4m2s
    wxo-external-agent-h4yc75nkwi2w-7fdb57bb57-sx8vk                      1/1     Running     0          2m25s
    ```  
7. Update application proxy config - copy `app-proxy-config.yaml` in this folder to `cpd-cli-workspace/olm-utils-workspace/work/`  
    ```
    ./cpd-cli manage update-custom-application-proxy-config \
    --instance_ns=zen \
    --app_name=wxo-external-agent \
    --app_run_id=<from create-dockerfile-application> \
    --app_proxy_config_yaml=/tmp/work/app-proxy-config.yaml
    ```

#### application available at `https://zen-route/physical_location/default-pl/<app_name-app_run_id>/docs`

To try it out, use this request body:  

    {
      "model": "ibm/granite-3-3-8b-instruct",
      "context": {},
      "messages": [
        {
          "role": "assistant",
          "content": "how to use foundational models?"
        }
      ],
      "stream": false
    }
