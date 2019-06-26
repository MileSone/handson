#!/usr/bin/env bash

docker run -d \
    --restart=always \
    --name=trainerbotccuat \
    -p 9089:8081 \
    fwd/trainerbotccuat:latest
