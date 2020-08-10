#! /bin/sh
echo "\n-------------------------Deleting customer manager application deployments-------------------------\n"
echo "\nRemoving mongo container: PV, PVC, Service, Deployment"
echo "\n===================================================================================================\n"
kubectl delete -f mongo.yaml
echo "\n===================================================================================================\n"
echo "\nRemoving customer manager service,deployment"
kubectl delete -f customer-manager-api.yaml
echo "\n===================================================================================================\n"
echo "\nVerifying the clean-up status of Persistent volumes"
echo "\n===================================================================================================\n"
kubectl get pv
echo "\n===================================================================================================\n"
echo "\nVerifying the clean-up status of Persistent volumes claims"
kubectl get pvc
echo "\n===================================================================================================\n"
echo "\nVerifying the status of pods"
kubectl get pods
echo "\n===================================================================================================\n"
