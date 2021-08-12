export http_proxy=http://{{ PROXY_SRVR }}:{{ PROXY_PORT }}
export https_proxy=http://{{ PROXY_SRVR }}:{{ PROXY_PORT }}

TEA_ID_DIR="/bootflash/guestshell/thousandeyes/var/lib/te-agent"
if [ -n "$TEA_ID_DIR" ]; then
  mkdir -p $TEA_ID_DIR
  if [ ! -e /var/lib/te-agent ]; then
    ln -s  $TEA_ID_DIR /var/lib/te-agent
  fi
fi

curl -Os https://downloads.thousandeyes.com/agent/install_thousandeyes.sh
chmod +x install_thousandeyes.sh
echo n | ./install_thousandeyes.sh -t STATIC -P {{ PROXY_SRVR }}:{{ PROXY_PORT }} {{ TE_ACCOUNT_TOKEN }} 

# proxy bypass can't be passed into the installer
TE_AGENT_CFG_LOCATION="/etc/te-agent.cfg"
PROXY_BYPASS=" {{ PROXY_BYPASS_LIST }}"
if [ -n "$PROXY_BYPASS" ]; then
    if grep -q "^proxy-bypass-list=" $TE_AGENT_CFG_LOCATION; then
        sed -i "s/proxy-bypass-list=.*/proxy-bypass-list=${PROXY_BYPASS}/" $TE_AGENT_CFG_LOCATION
    else
    # proxy-type is currently not in the packaged config file, so we need to add it
        echo "proxy-type=${CMD_PROXY_TYPE}" >> $TE_AGENT_CFG_LOCATION
    fi
fi


systemctl restart te-agent.service
