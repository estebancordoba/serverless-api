#!/bin/bash
npm run build:all
cdk bootstrap
cdk deploy --context env=$1