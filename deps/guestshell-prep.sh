dohost "sh run | in hostname" | awk '{ print $2 }' | xargs  -I{} hostnamectl set-hostname {}
export http_proxy=http://{{ PROXY_SRVR }}:{{ PROXY_PORT }}
export https_proxy=http://{{ PROXY_SRVR }}:{{ PROXY_PORT }}
yum -y update
