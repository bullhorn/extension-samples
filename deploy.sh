PROJECT_ID="bullhorn-app-starter"
version="516"
npm run package
gcloud config set project bullhorn-app-starter
gcloud config set compute/zone us-central1-b
docker build -t gcr.io/${PROJECT_ID}/bullhorn-starter:${version} .
gcloud docker -- push gcr.io/${PROJECT_ID}/bullhorn-starter:${version}

# kubectl run bullhorn-starter --image=gcr.io/${PROJECT_ID}/bullhorn-starter:latest --port 3000
# kubectl expose deployment bullhorn-starter --type=LoadBalancer --port 3000


kubectl set image deployment/bullhorn-starter bullhorn-starter=gcr.io/${PROJECT_ID}/bullhorn-starter:${version}
