#!groovy

node {
  currentBuild.result = "SUCCESS"

  try {
    stage('checkout') {
      checkout scm
    }

    stage('build') {
      sh 'npm install && npm run build'
    }

    stage('deploy') {
      sh 'chmod +x docker-build'
      sh 'sudo sh ./docker-build'
    }
  }

  catch (err) {
    currentBuild.result = "FAILURE"
    throw err
  }
}
