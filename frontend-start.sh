#!/usr/bin/env bash

docker run -d \
    --restart=always \
    --name=trainerbotfront \
    -p 8088:80 \
    hysunhe/trainerbotfront:latest
