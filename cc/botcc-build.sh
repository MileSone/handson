#!/usr/bin/env bash

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

docker build . -t fwd/trainerbotccuat:${TAG}
docker tag fwd/trainerbotccuat:${TAG}   fwd/trainerbotccuat:latest
