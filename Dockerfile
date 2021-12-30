FROM node:current-alpine

ARG CONFTEST_POLICY_REPO='github.com/ajaymehul/regula//rego/rules'

# Install git for pulling policies later
RUN apk add --no-cache git

# Install Conftest
RUN wget https://github.com/open-policy-agent/conftest/releases/download/v0.25.0/conftest_0.25.0_Linux_x86_64.tar.gz
RUN tar xzf conftest_0.25.0_Linux_x86_64.tar.gz
RUN mv conftest /usr/local/bin

WORKDIR /usr/src/app

# Install Conftest Regula Plugin
RUN conftest pull -p policy/ 'github.com/fugue/regula//rego/conftest?ref=v2.3.0'
RUN conftest pull -p policy/regula/lib 'github.com/fugue/regula//rego/lib?ref=v2.3.0'

# Download policies from Repo
RUN conftest pull -p policy/regula/rules $CONFTEST_POLICY_REPO

# Node App setup
COPY package.json .
RUN npm install
COPY . ./

# Port for server
EXPOSE 3000

CMD ["npm", "start"]



