#!/usr/bin/env sh

install_vc_test_suite=true
patch_open_attestation_cli=true # maybe it should be false by default
vc_path=vc-test-suite

if [ "$vc_path" = "" ]; then
  echo "No vc_path provided. Panic"
  exit 1
fi

if [ "$install_vc_test_suite" = true ] ; then
  echo "clean vc-test-suite"
  rm -rf $vc_path

  echo "clone vc-test-suite repo"
  git clone --depth 1 https://github.com/w3c/vc-test-suite.git $vc_path
  rm -rf $vc_path/.git

  echo "copy configuration into $vc_path"
  cp ./vc-test-suite-config.json $vc_path/config.json
  cd $vc_path || exit 1

  echo "Install dependencies"
  npm i

  echo "Install open-attestation-cli"
  npm i @govtechsg/open-attestation-cli
  cd ..
fi

if [ "$patch_open_attestation_cli" = true ] ; then
  echo "Monkey patch open-attestation"
  npm run build
  rm -rf $vc_path/node_modules/@govtechsg/open-attestation
  rsync -a . $vc_path/node_modules/@govtechsg/open-attestation --exclude $vc_path
fi

echo "Run tests"
cd $vc_path || exit 1
npm run test -- --timeout 12000
