# workshop-gitlab-ci

## Demo Database

- Create .env file.

```text
DB_URI=postgres://elhkxmbz:iBzXAwcF2vXQNoROQlAaVlK5RxY70Qu6@stampy.db.elephantsql.com:5432/elhkxmbz
```

## How to run CI/CD

### Step 1: Create .gitlab-ci.yml

```bash
touch .gitlab-ci.yml
```

### Step 2: Create jobs

```yml
test:
  script:
    - echo "Running testing script"

build:docker:
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  script:
    - echo "Running deploy script"
```

### Step 3: Add stage to each jobs

```yml
test:
  stage: test
  script:
    - echo "Running testing script"

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 4: Add stages management

```yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - echo "Running testing script"

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 5: Run unit test

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:unit

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 6: Run integration test

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:unit

test:integration:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:integration

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 7: Separate test pipelines

```yml
stages:
  - test
  - test:integration
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:unit

test:integration:
  image: node:10-alpine
  stage: test:integration
  before_script:
    - npm install
  script:
    - npm run test:integration

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 8: Test all in one job

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 9: Coverage test and capture it

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:coverage
  coverage: '/^All files\s+\|\s+\d+\.*\d*\s+\|\s*(\d+\.*\d*)/'
  artifacts:
    paths:
      - coverage/

build:docker:
  stage: build
  script:
    - echo "Running build docker image script"
    - exho "Running push docker image to registry script"

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 10: Build to docker image and push to gitlab registry

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:coverage
  coverage: '/^All files\s+\|\s+\d+\.*\d*\s+\|\s*(\d+\.*\d*)/'
  artifacts:
    paths:
      - coverage/

build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - docker build --pull -t "$CI_REGISTRY_IMAGE" .
    - docker push "$CI_REGISTRY_IMAGE"
  only:
    - master

deploy:prod:
  stage: deploy
  script:
    - echo "Running deploy script"
```

### Step 11: Deploy to server

- Create `SSH_PRIVATE_KEY`, `SSH_HOSTKEYS` variables (Settings > CI/CD > Vaiables)

- Update `.gitlab-ci.yml`

```yml
stages:
  - test
  - build
  - deploy

cache:
  paths:
    - node_modules/

test:
  image: node:10-alpine
  stage: test
  before_script:
    - npm install
  script:
    - npm run test:coverage
  coverage: '/^All files\s+\|\s+\d+\.*\d*\s+\|\s*(\d+\.*\d*)/'
  artifacts:
    paths:
      - coverage/

build:docker:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - docker build --pull -t "$CI_REGISTRY_IMAGE" .
    - docker push "$CI_REGISTRY_IMAGE"
  only:
    - master

deploy:prod:
  stage: deploy
  image: alpine
  before_script:
    - apk add --update openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | ssh-add -
    - mkdir -p ~/.ssh
    - echo "$SSH_HOSTKEYS" > ~/.ssh/known_hosts
  script:
    - scp -o stricthostkeychecking=no -r ./docker-compose.yml $SSH_USER_SERVER:docker-compose.yml
    - scp -o stricthostkeychecking=no -r ./sql $SSH_USER_SERVER:./sql
    - ssh $SSH_USER_SERVER ls
    - ssh $SSH_USER_SERVER docker-compose down
    - ssh $SSH_USER_SERVER docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
    - ssh $SSH_USER_SERVER docker pull registry.gitlab.com/somprasongd/gitlab-ci-cd-demo
    - ssh $SSH_USER_SERVER docker-compose up -d
  only:
    - tags
```
