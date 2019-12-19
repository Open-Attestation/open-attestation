#!/usr/bin/env sh
# run quicktype only for local environment
QUICKTYPE=$PWD/node_modules/.bin/quicktype

if [ -f "$QUICKTYPE" ] && [ "$npm_config_production" != "true" ]; then
    echo "Creating types from src/schema/2.0/schema.json"
    $QUICKTYPE -s schema -o src/__generated__/schemaV2.ts -t OpenAttestationDocument --just-types src/schema/2.0/schema.json --no-date-times
    echo "Creating types from src/schema/3.0/schema.json"
    $QUICKTYPE -s schema -o src/__generated__/schemaV3.ts -t OpenAttestationDocument --just-types src/schema/3.0/schema.json --no-date-times
else
    echo "Not running quicktype"
fi
