FROM risingstack/alpine:3.4-v6.3.0-3.6.2

WORKDIR /usr/src/bullhorn-starter

# Add the bundle
ADD bullhorn-starter.tar.gz /usr/src

RUN npm install -g pm2

EXPOSE 3000

CMD [ "pm2", "start", "ecosystem.json", "--no-daemon"]
