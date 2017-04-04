#!groovy

node {
  currentBuild.result = "SUCCESS"

  env.DOCKER_PORT      = (env.BRANCH_NAME == 'master') ? 8092 : 10092;
  env.DOCKER_CONTAINER = (env.BRANCH_NAME == 'master') ? "informasjonsmodell-documentation" : "informasjonsmodell-documentation_${env.BRANCH_NAME}"
  sh "echo Building branch: ${env.BRANCH_NAME} to ${env.DOCKER_CONTAINER}:${env.DOCKER_PORT}"

  try {
    stage('checkout') {
      checkout scm
    }

    stage('build') {
      sh 'npm install && npm run build'
    }

    stage('deploy') {
      sh 'chmod +x docker-build'
      sh 'sudo -E sh ./docker-build'
    }
  }

  catch (err) {
    currentBuild.result = "FAILURE"
    throw err
  }
}
