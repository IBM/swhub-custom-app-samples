# Deploy qna chatbot application to software hub default dataplane

[Q&A with RAG accelerator](Industry-Accelerators/watsonx.ai/QnA_chatbot_app/readme.md) is Sample Streamlit app that allows a user to ask questions about a given corpus of documents which are answered using a Retrieval Augmented Generation (RAG) approach, app is cloned from [here](https://github.com/IBM/Industry-Accelerators/tree/master/watsonx.ai/QnA_chatbot_app)

this is the instruction doc for deploying the app into software hub default dataplane:  
- follow the [application readme](Industry-Accelerators/watsonx.ai/QnA_chatbot_app/readme.md) to check and setup pre-requiste for deploying the application, this would require deployment of watsonx service endpoints into ibm cloud watsonx service, which will be created when you deploy [IBM Resource Hub](https://dataplatform.cloud.ibm.com/exchange/public/entry/view/75b22cbe-8a20-44a5-ac65-3a927e92cb0e?context=wx), this application will be interacting with the service endpoints through UI interface for Q&A sessions
- checkout the [pre-requisites](../README.md#pre-requisites-to-deploy-sample-applications) required before deploying this application into default dataplane  

#### Steps to deploy    
1. Update `QNA_RAG_DEPLOYMENT_URL` and `QNA_RAG_SAAS_IAM_APIKEY` from your deployment environment in qna_rag_chatbot/Industry-Accelerators/watsonx.ai/QnA_chatbot_app/.env
2. Run the follwing create-dockerfile-application command
```
./cpd-cli manage create-dockerfile-application --instance_ns=<cpd_instance_ns> --app_name=chatbot --app_port=8080 --app_port_tls=false --repo_url=https://github.com/IBM/swhub-custom-app-samples.git --repo_token=<YOUR GITHUB TOKEN> --repo_branch=<your branch with updated .env file in step 1> --repo_app_dir=qna_rag_chatbot/Industry-Accelerators/watsonx.ai/QnA_chatbot_app --cpu=400m --memory=200Mi --cpu_limit=500m --memory_limit=400Mi
```
3. Ensure the pods are running in the workload namespace
```
ps-chatbot-demo-l66n2b4a5tra-1-build                              0/1     Completed   0          5d
ps-chatbot-demo-l66n2b4a5tra-7b75f9d697-s8hqb                     1/1     Running     0          5d
ps-chatbot-jdsgxjtix71p-6bf7b7c4f7-mz78g                          1/1     Running     0          8d
ps-chatbot-three-vjzbpxir2vqo-79869dd7cf-m67xd                    1/1     Running     0          8d
```
