#!/bin/bash

if [ -f "./migrations/1_deploy_contracts.js" ];
then
    rm ./migrations/1_deploy_contracts.js &
fi
truffle test