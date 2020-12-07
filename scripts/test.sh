#!/usr/bin/env sh

vc_path=vc-test-suite

echo "clean vc-test-suite"
rm -rf $vc_path
echo "clone vc-test-suite repo"
git clone --depth 1 https://github.com/w3c/vc-test-suite.git $vc_path
echo "copy configuration into $vc_path"
cp ./vc-test-suite-config.json $vc_path/config.json
cd $vc_path || exit 1
echo "Install dependencies"
npm i
echo "Install open-attestation-cli"
npm i @govtechsg/open-attestation-cli
npm run test -- --timeout 12000

