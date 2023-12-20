
FROM node:16-alpine as node
ENV npm_config_cache /home/node/.npm
RUN apk update ; apk upgrade ; apk add bash
RUN npm cache clean --force 

SHELL [ "/bin/bash", "-c" ]

COPY . /home/node/

# change to directory
WORKDIR /home/node/

RUN apk add curl

ARG ENV
RUN yarn install
RUN if [[ "$ENV" = "qa" ]]; \
    then yarn run build:qa; \
    elif [[ "$ENV" = "prod" ]]; \
    then yarn run build:prod; \
    fi

RUN cp /home/node/public/envs/env.$ENV.js /home/node/build/
# For new build we can keep replace at the time of startup when we are going to know the exact domain hoowever for our envs we already know the domains
RUN mv /home/node/build/env.$ENV.js /home/node/build/env.js 

from alpine:3.15.3 as main

ARG ENV
RUN mkdir -p /home/private-gpt-ui /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/http.d

RUN apk update && apk add bash curl nginx openrc
RUN openrc ; touch /run/openrc/softlevel && echo 'rc_provide="loopback net"' >> /etc/rc.conf
# Tell openrc loopback and net are already there, since docker handles the networking

COPY --from=node /home/node/build/ /home/private-gpt-ui/build/

COPY --from=node /home/node/docker/ /home/node/docker/

COPY --from=node /home/node/docker/sites-enabled/* /etc/nginx/sites-enabled/
COPY --from=node /home/node/docker/sites-enabled/* /etc/nginx/sites-available/
COPY --from=node /home/node/docker/sites-enabled/* /etc/nginx/http.d/
COPY --from=node /home/node/docker/env.js /home/private-gpt-ui/build/

COPY startup.sh startup.sh

RUN chmod +x startup.sh

ENTRYPOINT ["/bin/bash", "startup.sh"]
