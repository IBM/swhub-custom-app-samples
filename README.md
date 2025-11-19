# Software Hub Custom Apps Samples

IBM Software Hub offered custom application capablity in 5.3, the purpose of the git repo is to host the sample applications for end user to download and try out.

The repo contains collection of custom sample apps that can be deployed into software hub default dataplane, each folder contains one sample app and README instructions for deployment

### Pre-requisites to deploy sample applications

Custom Apps is built on top of remote dataplanes concept. So, before deploying sample applications users need to have dataplanes setup.
refer [this doc](https://www.ibm.com/docs/en/software-hub/5.2.x?topic=installing-setting-up-remote-physical-location) to understand concept of remote dataplane and physical locations

`default dataplane` is a remote dataplane that resides on a regular software hub cluster. for setting up default dataplane, the following component are required:  

- Software Hub Scheduling Service
  refer [this doc](https://www.ibm.com/docs/en/software-hub/5.2.x?topic=cluster-installing-shared-components) for how to install scheduling service as cluster component
- Software Hub 5.3 premium cartrige and cpd-cli olm-utils premium image

To enable default dataplane using cpd-cli:

1. load olm-utils premium image: `export OLM_UTILS_IMAGE=icr.io/cpopen/cpd/olm-utils-v4:5.3.0-<premium image tag>`
2. Run `cpd-cli manage login-to-ocp -u kubeadmin -p <password> --server=<ocp_url>`
3. Run `cpd-cli manage enable-premuim-features --license_acceptance=true --features=enable_rdp --operator_ns=<project name> --instance_ns=<project name> --scheduler_ns=<project>`
4. Create two namespaces mgmt and workload(wl).
5. Run `cpd-cli manage enable-default-dataplane --instance_ns=zen --management_ns=mgmt --workload_ns=wl` this command will create a default physical location - `default-pl` and a default dataplane - `default-dp`.
