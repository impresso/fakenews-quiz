# 1. build
FROM node:12-alpine AS covid_builder

ARG GIT_BRANCH
ARG GIT_REVISION

WORKDIR /covid-19-survey-lux

RUN apk add --no-cache git build-base python

COPY package.json package-lock.json ./

RUN npm install

COPY src ./src
COPY public ./public

COPY .eslintrc .eslintignore .postcssrc.js .babelrc vue.config.js ./
# COPY .env .env.production ./

ENV NODE_ENV production
ENV COVID_GIT_BRANCH=${GIT_BRANCH}
ENV COVID_GIT_REVISION=${GIT_REVISION}

RUN npm run build

# 2. copy
FROM busybox

WORKDIR /covid-19-survey-lux

COPY --from=covid_builder /covid-19-survey-lux/dist ./
