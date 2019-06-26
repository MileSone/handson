#!/usr/bin/env bash

TAG=`date '+%Y-%m-%d-%H-%M-%S'`

docker build . -t hysunhe/trainerbotfront:${TAG}
docker tag hysunhe/trainerbotfront:${TAG}   hysunhe/trainerbotfront:latest
