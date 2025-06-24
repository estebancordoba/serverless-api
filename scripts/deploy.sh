#!/bin/bash
npm run build
cdk bootstrap
cdk deploy --context env=$1