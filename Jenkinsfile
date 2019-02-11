pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh "docker build --tag ${GIT_COMMIT} ."
            }
        }
        stage('Publish') {
            steps {
                sh "docker tag ${GIT_COMMIT} dtr.fintlabs.no/beta/information-model-documentation-portal:${BRANCH_NAME}.${BUILD_NUMBER}"
                withDockerRegistry([credentialsId: 'dtr-fintlabs-no', url: 'https://dtr.fintlabs.no']) {
                    sh "docker push dtr.fintlabs.no/beta/information-model-documentation-portal:${BRANCH_NAME}.${BUILD_NUMBER}"
                }
                sh "docker tag ${GIT_COMMIT} fintlabs.azurecr.io/information-model-documentation-portal:${BRANCH_NAME}.${BUILD_NUMBER}"
                withDockerRegistry([credentialsId: 'fintlabs.azurecr.io', url: 'https://fintlabs.azurecr.io']) {
                    sh "docker push fintlabs.azurecr.io/information-model-documentation-portal:${BRANCH_NAME}.${BUILD_NUMBER}"
                }
            }
        }
    }
}
