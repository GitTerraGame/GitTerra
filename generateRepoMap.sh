#!/bin/bash

# Name of the executed script
scriptname=$0;

function usage {
    echo "USAGE: $scriptname --url <url-of-github-repo>"; 
    echo "Examples:";
    echo "$scriptname --url https://github.com/GitTerraGame/GitTerra";
    echo "$scriptname --url https://github.com/GitTerraGame/GitTerra.git";
    exit 1;
}

# attempting to read repo URL from STDIN
if test -t 0; then
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            -u|--url|-url) gitname="$2";shift ;;
            *) usage
            exit 1 ;;
        esac
        shift
    done
    # open the file once generated
    OPEN_ARGS="-o"
else
    gitname=$(cat -);
    OPEN_ARGS=""
fi

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
status_code=$(curl --write-out "%{http_code}\n" --silent \
--output /dev/null https://api.github.com/repos/"$owner"/"$repo")
#echo "status_code" $status_code
if [[ "$status_code" -ne 200 ]] ; then
echo "We cannot process your repo"
exit 1
fi
sizelimit=100000 #~ 100MB
size=$(curl https://api.github.com/repos/$owner/$repo 2> /dev/null | grep size | tr -dc '[:digit:]')
#echo "size:" $size
if [[ "$size" -gt "$sizelimit" ]] ; then
echo "Sorry, your repo is too big to be processed on our server."
exit 1
fi
TEMP_FOLDER=$(mktemp -d)
currentDir=$(pwd)
#git clone --quiet --depth 1 "$gitname" $TEMP_FOLDER > /dev/null
#git clone --quiet --single-branch --filter=blob:none --shallow-submodules "$gitname" $TEMP_FOLDER > /dev/null
git clone --quiet --single-branch --shallow-submodules "$gitname" $TEMP_FOLDER > /dev/null
scc -f json $TEMP_FOLDER | node src/main.js -u "$gitname" $OPEN_ARGS
cd $TEMP_FOLDER && git log --date=local --reverse --no-merges --shortstat \
    --pretty="%x40%h%x7E%x7E%cd%x7E%x7E%<(79,trunc)%f%x7E%x7E" \
    | tr "\n" " " \
    | tr "@" "\n" \
    | node "$currentDir/src/readCommits.js"
rm -rf $TEMP_FOLDER
exit 0