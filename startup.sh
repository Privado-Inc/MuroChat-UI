#!/bin/bash -xv

echo $ENV

echo "Starting GPT Application"

service nginx stop



# Not able to directly sed on the file so doing it like this
cp /home/private-gpt-ui/build/env.js /home/env.js
sed -i -e "s#__DOMAIN_NAME__#$DOMAIN_NAME#g" /home/env.js
sed -i -e "s#__PROTOCOL__#$PROTOCOL#g" /home/env.js
cp /home/env.js /home/private-gpt-ui/build/env.js

cp /etc/nginx/sites-enabled/frontend.conf /home/frontend.conf
sed -i -e "s#__DOMAIN__NAME__#$DOMAIN_NAME#g" /home/frontend.conf
sed -i -e "s#__LB_DNS_NAME__#$LB_DNS_NAME#g" /home/frontend.conf

cp /home/frontend.conf /etc/nginx/sites-enabled/frontend.conf
cp /home/frontend.conf /etc/nginx/sites-available/frontend.conf
cp /home/frontend.conf /etc/nginx/http.d/frontend.conf

apk update && apk add bash curl nginx openrc
openrc ; touch /run/openrc/softlevel && echo 'rc_provide="loopback net"' >> /etc/rc.conf

rm -rf /etc/nginx/http.d/default.conf
# start nginx
service nginx start

echo "Muro Chat up and running..."
tail -f /dev/null
