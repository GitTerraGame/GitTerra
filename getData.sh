#!/bin/bash
function usage {
    echo "USAGE: $scriptname --url <url-of-github-repo>"; 
    echo "Example: $scriptname --url https://github.com/GitTerraGame/GitTerra or";
    echo "Example: $scriptname --url git@github.com:GitTerraGame/GitTerra.git or";
    echo "Example: $scriptname --url https://github.com/GitTerraGame/GitTerra.git";
}
scriptname='getData.sh'
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -url) gitname="$2";shift ;;
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
fi
#echo "owner: $owner"
#echo "repo: $repo"
cd ./temp || exit 1
git clone --quiet --depth 1 "$gitname" > /dev/null
#scc  -o ./sccresult.txt "$repo"  > /dev/null
scc --format-multi "tabular:sccresult.txt,json:sccresult.json" "$repo"
rm -rf "$repo"
cd ..
node main.js -o "$owner" -r "$repo"
exit 0