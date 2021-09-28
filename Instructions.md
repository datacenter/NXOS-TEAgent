# Instructions
The following document is a guide to configuring and installing the ThousandEyes Agent on Cisco Nexus 9000 and Nexus 3600-R switches, running NX-OS. This is just one workflow, however there are other workflows that can be used to achieve this via Ansible, depending on your setup. 

The ThousandEyes Agent is run within the guestshell on NX-OS, which is an isolated CentOS environment on the switch. Additional information on guestshell can be found on [Cisco.com](https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/102x/programmability/cisco-nexus-9000-series-nx-os-programmability-guide-release-102x/m-n9k-guest-shell-101x.html)

Initially, the ThousandEyes Agent is supported on the following NX-OS versions 

* 9.3(7a) with the following ThousandEyes SMU installed. [link](https://software.cisco.com/download/home/286314783/type/286278856/release/9.3(7a)?i=!pp)
* 9.3(8) with the following ThousandEyes SMU installed. [link](https://software.cisco.com/download/home/286314783/type/286278856/release/9.3(8)?i=!pp)
* 10.2(1) with the following ThousandEyes SMU installed. [link](https://software.cisco.com/download/home/286314783/type/286278856/release/10.2(1)?i=!pp). Please install the 32 bit or 64 bit SMU, whichever is relevant to your platform. Please review the release notes for the release on [Cisco.com](https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/102x/release-notes/cisco-nexus-9000-nxos-release-notes-1021.html) for this platform specific information. 

It will be supported on all subsequent versions of NX-OS.

## Customization

The Ansible playbook and related YAML files, will require customization to suit each specific deployment scenario. 

1. In the teagent_hostname.yaml file, common variables across hosts can be configured such as http_proxy, domain, ThousandEyes token etc can be specified.
2. The hosts and host specific variables, such as hostname and file_paths can be provided in the inventory.yaml file.
3. Depending on the current state of the guestshell certain customizations of the guestshell may be required. The playbook called nxos.yaml needs to be adjusted to address various scenarios. If the guestshell meet the following requirements, no changes are required. 
	* 1024M rootfs
	* 512M memory
	* 7% CPU
 

	The playbook in this repo destroys and then configures the guestshell for a clean deployment, however if maintaining the current state of the guestshell is required, that task can be removed. 
	
The duration taken to install the ThousandEyes Agent can vary, depending on several factors, including the CPU and memory allotted to the guestshell, the link speed to download the ThousandEyes Agent, amongst others factors. Pauses and timeouts are incorporated into the playbook to address this variability, but may need to be adjusted to suit a unique deployment scenario. 


