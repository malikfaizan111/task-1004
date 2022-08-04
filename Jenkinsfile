pipeline {
    agent any
    environment {
        MSG = ''
        AUTHOR=''   
        MSTEAMS_HOOK='https://andpercentcom.webhook.office.com/webhookb2/f666f35d-4583-4058-b52b-9a4835d6873d@a8d4876b-beb2-4dd3-82ef-64221ad445ed/JenkinsCI/6a7805b2a1514ad0a9250cdffcb51f1b/a3e05267-c4ba-41eb-bd35-74bff6830be6'
    }
    stages {
        stage('Clone repository') {
            steps {
            checkout scm
            }
        }
       
        stage('get_commit_details') {
            steps {
             script {
                    MSG = sh ( script: 'git log -1 --pretty=%B', returnStdout: true ).trim()
                    AUTHOR = sh ( script: 'git log -1 --pretty=%ce', returnStdout: true ).trim()
              } 
           }
         } 
         
                 
        stage('Deployment to Pre Development'){
            steps{
                script{
                    echo scm.branches[0].name
                    if (scm.branches[0].name == "cms_internal") {
                    sh '''#!/bin/bash
                    sudo su
                    sudo ng build
                    sudo rsync --progress -r -e "ssh -i /home/ubuntu/jenkins-server-keys/urbanpoint_key.pem" /var/lib/jenkins/workspace/MultibranchPipeline_cms_internal/dist/UrbanPoint/* ubuntu@3.69.151.82:/var/www/html/cms/
          '''
                    }
                    else{
                        echo "No Commit for Pre Development"
                    }
                }
            }
        }
        stage('Deployment to Staging'){
            steps{
                script{
                    echo scm.branches[0].name
                    if (scm.branches[0].name == "cms_develop") {
                    sh '''#!/bin/bash
                    sudo su
                    sudo ng build
                    sudo rsync --progress -r -e "ssh -i /home/ubuntu/jenkins-server-keys/urbanpoint_key.pem" /var/lib/jenkins/workspace/ultibranchPipeline_cms_develop_2/dist/UrbanPoint/* ubuntu@3.126.59.153:/var/www/html/urbanpoint_staging_cms/
          '''
                    }
                    else{
                        echo "No Commit for Staging environment"
                    }
                }
            }
        }
        stage('Deployment to Production'){
            steps{
                script{
                    echo scm.branches[0].name
                    if (scm.branches[0].name == "cms_production") {
                    sh '''#!/bin/bash
                    sudo su
                    sudo node --max_old_space_size=5120 /usr/bin/ng build --prod
                    sudo rsync --progress -r -e "ssh -i /home/ubuntu/jenkins-server-keys/urbanpoint_key.pem" /var/lib/jenkins/workspace/ibranchPipeline_cms_production_2/dist/UrbanPoint/* ubuntu@18.196.90.62:/var/www/html/UrbanPoint_CMS/
          '''
                    }
                    else{
                        echo "No Commit for Live environment"
                        }
                }
            }
        }
        stage('Deployment to Pre Production'){
            steps{
                script{
                    echo scm.branches[0].name
                    if (scm.branches[0].name == "cms_preproduction") {
                    sh '''#!/bin/bash
                    sudo su
                    sudo ng build
                    sudo rsync --progress -r -e "ssh -i /home/ubuntu/jenkins-server-keys/urbanpoint_key.pem" /var/lib/jenkins/workspace/anchPipeline_cms_preproduction_2/dist/UrbanPoint/* ubuntu@18.195.183.123:/var/www/html/CMS/
          '''
                    }
                    else{
                        echo "No Commit for Live environment"
                        }
                }
            }
        }
    }
    post{
            success {
              office365ConnectorSend (
   		 status: "Pipeline Status",
    		 webhookUrl: "${MSTEAMS_HOOK}",
    		 color: '00ff00',
    		 message: "Build Successful: ${JOB_NAME} - ${BUILD_DISPLAY_NAME}<br>Pipeline duration: ${currentBuild.durationString}<br>Author Name: ${AUTHOR}<br>Commit Message: ${MSG}"
               )
            }
            failure {
              office365ConnectorSend (
   		 status: "Pipeline Status",
    		 webhookUrl: "${MSTEAMS_HOOK}",
    		 color: 'ff0000',
    		 message: "Build Unsuccessful: ${JOB_NAME} - ${BUILD_DISPLAY_NAME}<br>Pipeline duration: ${currentBuild.durationString}<br>Author Name: ${AUTHOR}<br>Commit Message: ${MSG}"
               )
            }
            unstable{
             office365ConnectorSend (
   		 status: "Pipeline Status",
    		 webhookUrl: "${MSTEAMS_HOOK}",
    		 color: 'ff0000',
    		 message: "Build Unstable: ${JOB_NAME} - ${BUILD_DISPLAY_NAME}<br>Pipeline duration: ${currentBuild.durationString}<br>Author Name: ${AUTHOR}<br>Commit Message: ${MSG}"
               ) 
        
            }
        }
}