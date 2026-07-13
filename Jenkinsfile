pipeline {
    agent any

    stages {

        stage('Verify Node') {
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
            echo '🎉 CI Pipeline Completed Successfully!'
        }

        failure {
            echo '❌ CI Pipeline Failed!'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}