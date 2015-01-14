#!/usr/bin/env bash

if [ $# -ne 1 ]; then echo "Syntax: $0 DIR" 2>&1; exit 1; fi
if [ ! -e "$1" ]; then echo "Directory \"$1\" does not exist" 2>&1; exit 1; fi
if [ ! -d "$1" ]; then echo "File \"$1\" exists but is not a directory" 2>&1; exit 1; fi
if [ ! -r "$1" ]; then echo "Directory \"$1\" exists but is not readable" 2>&1; exit 1; fi
if [ ! -w "$1" ]; then echo "Directory \"$1\" exists but is not readable" 2>&1; exit 1; fi

echo "Deploying \"$1\" to gh-pages..."

( cd "$1"
  git init
  git config user.name "Travis CI"
  git config user.email "travis@nodemeatspace.com"
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)

echo "Done"
