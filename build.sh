aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 673764500118.dkr.ecr.eu-central-1.amazonaws.com
docker build -t node-mines .
docker tag node-mines:latest 673764500118.dkr.ecr.eu-central-1.amazonaws.com/node-mines:latest
docker push 673764500118.dkr.ecr.eu-central-1.amazonaws.com/node-mines:latest
