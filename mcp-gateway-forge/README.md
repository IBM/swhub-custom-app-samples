# deploy mcp-context-forge app to software hub default dataplane

[ContextForge MCP Gateway](https://github.com/IBM/mcp-context-forge) is a feature-rich gateway, proxy and MCP Registry that federates MCP and REST services - unifying discovery, auth, rate-limiting, observability, virtual servers, multi-transport protocols, and an optional Admin UI into one clean endpoint for your AI clients

Checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application.

### deploy mcp-context-forge with sql lite database:  

- download proxy-config-yaml file:  
  ```
  download ./mcp-gateway-forge.conf.yaml and move to cpd-cli-workspace/olm-utils-workspace/work/mcp-gateway-forge.conf.yaml
  ```

- create app-envs-json-sqlite.json:  

  ```
  $ cat cpd-cli-workspace/olm-utils-workspace/work/app-env-json.json
    {"HOST":"0.0.0.0","JWT_SECRET_KEY":"my-test-key","BASIC_AUTH_USER":"admin@example.com","BASIC_AUTH_PASSWORD":"changeme","AUTH_REQUIRED":"true","DATABASE_URL":"sqlite:////data/mcp.db","SSL":"true","CERT_FILE":"/etc/certs/tls.crt","KEY_FILE":"/etc/certs/tls.key","MCPGATEWAY_UI_ENABLED":"true","MCPGATEWAY_ADMIN_API_ENABLED":"true"}
  ```

- run cpd-cli create-dockerfile-application:  
  ```
  cpd-cli manage create-dockerfile-application --instance_ns=zen \
    --app_name=mcp-context-forge-sqlite  \
    --app_port=4444 \
    --app_port_tls=true \
    --repo_url=https://github.com/IBM/mcp-context-forge.git \
    --repo_branch=main  \
    --dockerfile=Containerfile  \
    --app_envs_json=/tmp/work/app-envs-json-sqlite.json \
    --pvc_info={"size":"2Gi","mount_path":"/data"}  \
    --app_proxy_config_yaml=/tmp/work/mcp-gateway-forge.conf.yaml \
    --cpu=400m  \
    --memory=200Mi  \
    --cpu_limit=500m  \
    --memory_limit=400Mi
  ```

### deploy mcp-context-forge with postgres database:  

  #### deploy postgresql  

  - download postgresql template tar
  ```
    download postgresql.template.tgz to cpd-cli-workspace/olm-utils-workspace/work/postgesql.template.tgz
  ```
  - create postgres app template parameters json file:
    ```
    $ cat cpd-cli-workspace/olm-utils-workspace/work/app-parameters-json.json  
      {"DATABASE_SERVICE_NAME":"postgresql-mcp-context-forge","POSTGRESQL_USER":"postgres","POSTGRESQL_PASSWORD":"secret","POSTGRESQL_DATABASE":"mcp"}
    ```

  - run following cpd-cli command:  
    ```
    ./cpd-cli manage create-oc-template-application --instance_ns=zen  \
        --app_name=postgresql-mcp-context-forge  \
        --app_template=/tmp/work/postgesql.template.tgz  \
        --app_template_parameters_json=/tmp/work/app-parameters-json.json \
        --cpu=400m  \
        --memory=200Mi  \
        --cpu_limit=500m  \
        --memory_limit=400Mi
    ```
  #### deploy mcp-context-forge

  - create app-envs-json.json:  
    ```
    $ cat cpd-cli-workspace/olm-utils-workspace/work/app-envs-json-postgresql.json  

    {"HOST":"0.0.0.0","JWT_SECRET_KEY":"my-test-key","BASIC_AUTH_USER":"admin@example.com","BASIC_AUTH_PASSWORD":"changeme","AUTH_REQUIRED":"true","DATABASE_URL":"postgresql://postgres:secret@postgresql-mcp-context-forge:5432/mcp","SSL":"true","CERT_FILE":"/etc/certs/tls.crt","KEY_FILE":"/etc/certs/tls.key","MCPGATEWAY_UI_ENABLED":"true","MCPGATEWAY_ADMIN_API_ENABLED":"true"}
    ```  
  - run cpd-cli create-dockerfile-application command:  
    ```
    cpd-cli manage create-dockerfile-application --instance_ns=zen \
      --app_name=mcp-context-forge-postgresql  \
      --app_port=4444 \
      --app_port_tls=true \
      --repo_url=https://github.com/IBM/mcp-context-forge.git \
      --repo_branch=main  \
      --dockerfile=Containerfile  \
      --app_envs_json=/tmp/work/app-envs-json-postgresql.json \
      --app_proxy_config_yaml=/tmp/work/mcp-gateway-forge.conf.yaml \
      --cpu=400m  \
      --memory=200Mi  \
      --cpu_limit=500m  \
      --memory_limit=400Mi
    ```
