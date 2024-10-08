#!/usr/bin/env sh

dockerize -wait tcp://web:80 -timeout 4000s

echo "Running wpscan"
echo "$@";
/usr/local/bundle/bin/wpscan "$@" | tee /wpscan/output.txt