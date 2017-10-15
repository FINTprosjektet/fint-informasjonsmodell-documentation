pipeline {
    agent any
    stages {
        stage('Build') {
            when {
                branch 'master'
            }
            steps {
                sh "docker build --tag dtr.rogfk.no/fint-beta/information-model-documentation-portal:latest ."
            }
        }
        stage('Publish') {
            when {
                branch 'master'
            }
            steps {
                withDockerRegistry([credentialsId: 'dtr-rogfk-no', url: 'https://dtr.rogfk.no']) {
                    sh "docker push dtr.rogfk.no/fint-beta/information-model-documentation-portal:latest"
                }
            }
        }
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                withDockerServer([credentialsId: "ucp-jenkins-bundle", uri: "tcp://ucp.rogfk.no:443"]) {
                    sh "docker service update fint-informasjonsmodell-documentation_docs --image dtr.rogfk.no/fint-beta/information-model-documentation-portal:latest --detach=false"
                }
            }
        }
    }
}
