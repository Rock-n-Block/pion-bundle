#!/bin/bash

if [[ ! -f "./migrations/1_deploy_contracts.js" ]]
then
    cp ./scripts/1_deploy_contracts.js ./migrations/
fi