#!/bin/bash
function usage {
    echo "USAGE: $scriptname --url <url-of-github-repo>"; 
    echo "Examples:";
    echo "$scriptname --url git@github.com:GitTerraGame/GitTerra";
    echo "$scriptname --url git@github.com:GitTerraGame/GitTerra.git";
    echo "$scriptname --url https://github.com/GitTerraGame/GitTerra.git";
    exit 1;
}
scriptname=$0;
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -u|--url|-url) gitname="$2";shift ;;
        *) usage
        exit 1 ;;
    esac
    shift
done
#validate input
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
scc -f json $TEMP_FOLDER | node main.js -url "$gitname"
rm -rf $TEMP_FOLDER
exit 0