dohost "sh run | in hostname" | awk '{ print $2 }' > /etc/hostname

cat /etc/hostname

cat >>"/etc/yum.conf" <<'EOF'
proxy=http://{{ http_proxy }}
EOF
 
cat /etc/yum.conf

cat >"/etc/resolv.conf" <<'EOF'
domain {{ domain_name }}
search {{ domain_name }}
nameserver {{ name_server1 }}
nameserver {{ name_server2 }}
EOF

cat >"/etc/ntp.conf" <<'EOF'
server {{ ntp_server1 }}
server {{ ntp_server2 }}
server {{ ntp_server3 }}
EOF

export http_proxy=http://{{ http_proxy }}
export https_proxy=http://{{ https_proxy}}

cat >"/usr/bin/relocate_rpm_locks.sh" <<'EOF'
#!/bin/bash

touch /run_relocate_rpm_locks
TGT_DIR="/var/volatile/var/lib/rpm"
mkdir -p "$TGT_DIR"
 
DB_FILES=$(ls /var/lib/rpm/__db*)
for FILE in $DB_FILES
do
    rm -f "$FILE"
done

rpm -q te-agent > /dev/null

DB_FILES=$(ls /var/lib/rpm/__db*)
for FILE in $DB_FILES
do
    FILE_NAME=$(basename "$FILE")
    mv "$FILE" "$TGT_DIR"/"$FILE_NAME"
    ln -sf "$TGT_DIR"/"$FILE_NAME" "$FILE"
    echo "Linked $FILE"
done
EOF

chmod +x /usr/bin/relocate_rpm_locks.sh

cat >"/etc/systemd/system/relocate_rpm_locks.service" <<'EOF'
[Unit]
Description=Relocate RPM lock files to tmpfs
DefaultDependencies=no
After=local-fs.target
Before=network-online.target
 
[Service]
Type=oneshot
ExecStart=/usr/bin/relocate_rpm_locks.sh
RemainAfterExit=True
[Install]
WantedBy=multi-user.target
EOF

systemctl enable relocate_rpm_locks
 
yum -y update

df -h . 
yum clean all
rm -rf /usr/lib/locale/*
rm -rf /usr/lib/udev
rm -rf /etc/udev
rm -rf /usr/share/doc/*
rm -rf /usr/share/locale/*
find /usr/share/man ! -type d -delete
df -h .
                                   
exit
exit
exit
