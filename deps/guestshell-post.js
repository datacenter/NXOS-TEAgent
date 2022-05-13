VRF="{{ vrf_name }}"

mkdir -p /etc/systemd/system/te-agent.service.d
EXEC_CONF="/etc/systemd/system/te-agent.service.d/exec.conf"
TEA_DB_DIR="/volatile/thousandeyes/var/lib/te-agent"
cat >"$EXEC_CONF" <<'EOF'
[Service]
ExecStart=
EOF
echo "ExecStart=/bin/nsenter --net=/var/run/netns/$VRF -- /usr/local/bin/te-agent -C /etc/te-agent.cfg" >> $EXEC_CONF
echo "ExecStartPre=/usr/bin/mkdir -p $TEA_DB_DIR" >>  $EXEC_CONF
 
cat $EXEC_CONF

TEA_ID_DIR="/bootflash/thousandeyes/var/lib/te-agent"
 
mkdir -p $TEA_ID_DIR
mkdir -p $TEA_DB_DIR
 
 
if [ ! -e /var/lib/te-agent ]; then
  ln -s  $TEA_ID_DIR /var/lib/te-agent
fi

export https_proxy=http://{{ https_proxy }}
 
curl -Os https://downloads.thousandeyes.com/agent/install_thousandeyes.sh
chmod +x install_thousandeyes.sh
 
export https_proxy=
 
echo n | ./install_thousandeyes.sh -O -t STATIC -P {{ https_proxy }} {{ te_token }}

TE_AGENT_CFG_LOCATION="/etc/te-agent.cfg"
PROXY_BYPASS="*.cisco.com;*.ciscointernal.com"
if [ -n "$PROXY_BYPASS" ]; then
    if grep -q "^proxy-bypass-list=" $TE_AGENT_CFG_LOCATION; then
        sed -i "s/proxy-bypass-list=.*/proxy-bypass-list=${PROXY_BYPASS}/" $TE_AGENT_CFG_LOCATION
    else
        echo "proxy-bypass-list=${PROXY_BYPASS}" >> $TE_AGENT_CFG_LOCATION
    fi
fi

TE_AGENT_CFG_LOCATION="/etc/te-agent.cfg"
DB_RELOC="$TEA_DB_DIR/te-agent.sqlite"
if [ -n "$DB_RELOC" ]; then
    if grep -q "^db=" $TE_AGENT_CFG_LOCATION; then
        sed -i "s/db=.*/db=${DB_RELOC}/" $TE_AGENT_CFG_LOCATION
    else
        echo "db=${DB_RELOC}" >> $TE_AGENT_CFG_LOCATION
    fi
fi

########
# 2022-05-13 Updated to prevent logging to .warn files.
# Warnings are already in the .log files and are removed to save tmpfs space
if grep -q "^num-warn-log-files=" $TE_AGENT_CFG_LOCATION; then
    sed -i "s/num-warn-log-files=.*/num-warn-log-files=0/" $TE_AGENT_CFG_LOCATION
else
    # num-warn-log-files is currently not in the packaged config file, so we need to add it
    echo "num-warn-log-files=0" >> $TE_AGENT_CFG_LOCATION
fi
 

cat $TE_AGENT_CFG_LOCATION

systemctl start te-agent
systemctl enable te-agent
 
systemctl status te-agent.service
systemctl is-enabled te-agent
