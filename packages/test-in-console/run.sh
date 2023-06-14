#!/usr/bin/env bash

# from Meteor local checkout run like
# ./packages/test-in-console/run.sh
# or for a specific package
# ./packages/test-in-console/run.sh "mongo"

cd $(dirname $0)/../..
export METEOR_HOME=`pwd`

export phantom=$phantom

# only install dependencies if required
if [ "$phantom" = true ]
then
    # Just in case these packages haven't been installed elsewhere.
    ./meteor npm install -g phantomjs-prebuilt browserstack-webdriver
else
    # Installs into dev_bundle/lib/node_modules/puppeteer.
    # puppeteer 20 is not compatible with node 14
    ./meteor npm install -g puppeteer@19
fi

export PATH=$METEOR_HOME:$PATH
# synchronously get the dev bundle and NPM modules if they're not there.
./meteor --help || exit 1

export URL='http://localhost:4096/'
export METEOR_PACKAGE_DIRS='packages/deprecated'

exec 3< <(meteor test-packages --driver-package test-in-console -p 4096 --exclude ${TEST_PACKAGES_EXCLUDE:-''} $1)
EXEC_PID=$!

sed '/test-in-console listening$/q' <&3

if [ "$phantom" = true ]
then
    ./dev_bundle/bin/phantomjs "$METEOR_HOME/packages/test-in-console/phantomRunner.js"
else
    node "$METEOR_HOME/packages/test-in-console/puppeteerRunner.js"
fi

STATUS=$?

pkill -TERM -P $EXEC_PID
exit $STATUS
