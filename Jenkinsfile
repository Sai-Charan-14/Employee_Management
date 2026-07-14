pipeline {
    agent any

    environment {
        IMAGE_NAME = "employee-management"
        CONTAINER_NAME = "employee-management-container"
    }

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

        // -------- NEW STAGE --------
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        // -------- NEW STAGE --------
        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        // -------- NEW STAGE --------
        stage('Deploy New Container') {
            steps {
                sh '''
                docker run -d \
                --name $CONTAINER_NAME \
                -p 5000:5000 \
                $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 CI/CD Pipeline Completed Successfully!'
        }

        failure {
            echo '❌ CI/CD Pipeline Failed!'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}