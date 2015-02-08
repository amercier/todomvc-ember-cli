#!/usr/bin/env bash

if [ $# -ne 2 ]; then
  echo "Syntax: $0 DIR BASEURL" 2>&1
  exit 1
fi

if [ -e "$1" ]; then
  echo -n  "Deleting $1... "
  rm -rf "$1" && echo OK
fi

mkdir "$1"

./node_modules/.bin/ember build --environment=production --output-path="$1"
./node_modules/.bin/ember build --output-path="$1/dev"

search='<base href="/" />'
replace1='<base href="'$2'/" />'
replace2='<base href="'$2/dev'/" />'

if [[ "$OSTYPE" == "darwin"* ]]; then
  # MacOS
  sed -i '' -e "s#$search#$replace1#" "$1/index.html"
  sed -i '' -e "s#$search#$replace2#" "$1/dev/index.html"
  sed -i '' -e "s#$search#$replace2#" "$1/dev/tests/index.html"
else
  sed -i -e "s#$search#$replace1#" "$1/index.html"
  sed -i -e "s#$search#$replace2#" "$1/dev/index.html"
  sed -i -e "s#$search#$replace2#" "$1/dev/tests/index.html"
fi

echo " " > "$1/.nojekyll"
