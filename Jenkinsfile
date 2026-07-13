pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    stages {

        stage('Verify NodeJS') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {
        success {
            echo 'CI Pipeline Completed Successfully!'
        }

        failure {
            echo 'CI Pipeline Failed!'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}