#!/usr/bin/env bash

rm -rf node_modules/
npm install --production
npx @vercel/ncc build src/index.js
