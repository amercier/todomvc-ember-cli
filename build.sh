#!/usr/bin/env bash

DIR=dist

if [ $# -ne 2 ]; then
  echo "Syntax: $0 DIR BASEURL" 2>&1
  exit 1
fi

if [ -e "$1" ]; then
  echo -n  "Deleting $1... "
  rm -rf "$1" && echo OK
fi

mkdir "$1"

ember build --output-path="$1"

search='<base href="/" />'
replace='<base href="'$2'/" />'

if [[ "$OSTYPE" == "darwin"* ]]; then
  # MacOS
  sed -i '' -e "s#$search#$replace#" "$1/index.html"
  sed -i '' -e "s#$search#$replace#" "$1/tests/index.html"
else
  sed -i -e "s#$search#$replace#" "$1/index.html"
  sed -i -e "s#$search#$replace#" "$1/tests/index.html"
fi

echo " " > "$1/.nojekyll"
