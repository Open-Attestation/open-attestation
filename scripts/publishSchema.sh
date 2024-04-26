#!/usr/bin/env sh

# Remove previously published schema
rm -rf ./public
mkdir public

# Copy 2.0 schema to public folder
mkdir -p public/2.0/
cp src/2.0/schema/schema.json public/2.0/schema.json

# Copy 3.0 schema to public folder
mkdir -p public/3.0/
cp src/3.0/schema/schema.json public/3.0/schema.json
