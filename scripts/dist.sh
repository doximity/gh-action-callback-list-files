#!/usr/bin/env bash

rm -rf node_modules/
npm install --production
ncc build src/index.js
