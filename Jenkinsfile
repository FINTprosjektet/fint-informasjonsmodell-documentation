pipeline {
    agent any
    stages {
        stage('Build') {
            when {
                branch 'master'
            }
            steps {
                sh "docker build --tag dtr.fintlabs.no/beta/information-model-documentation-portal:latest ."
            }
        }
        stage('Publish') {
            when {
                branch 'master'
            }
            steps {
                withDockerRegistry([credentialsId: 'dtr-fintlabs-no', url: 'https://dtr.fintlabs.no']) {
                    sh "docker push dtr.fintlabs.no/beta/information-model-documentation-portal:latest"
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                withDockerServer([credentialsId: "ucp-fintlabs-jenkins-bundle", uri: "tcp://ucp.fintlabs.no:443"]) {
                    sh "docker service update documentation-portal_docs --image dtr.fintlabs.no/beta/information-model-documentation-portal:latest --detach=false"
                    // sh "docker service update fint-metamodell-documentation_docs --image dtr.fintlabs.no/beta/information-model-documentation-portal:latest --detach=false"
                }
            }
        }
    }
}
