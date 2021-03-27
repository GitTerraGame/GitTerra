#!/bin/bash

gitname=$(cat -)

# validate input
regex='github\.com[:|\/](.+)\/(.+)$'
regex1='(.+)\.git$'
if [[ $gitname =~ $regex ]]; then
    owner=${BASH_REMATCH[1]} 
    repo=${BASH_REMATCH[2]}
    if [[ $repo =~ $regex1 ]]; then
        repo=${BASH_REMATCH[1]}
    fi
else
    echo "Not correct github repo name."
    usage
    exit 1
fi

TEMP_FOLDER=$(mktemp -d)
git clone --quiet --depth 1 "$gitname" $TEMP_FOLDER > /dev/null
scc -f json $TEMP_FOLDER | node main.js
rm -rf $TEMP_FOLDER
exit 0