npx webpack

docker stop trainerbotfront
docker rm trainerbotfront
./frontend-build.sh
./frontend-start.sh
