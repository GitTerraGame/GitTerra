# GitTerra

A game of coding where you can play by doing the usual coding activities

## Installation

Clone this repository

```
git clone --depth 1 https://github.com/GitTerraGame/GitTerra
cd GitTerra
```

### Dependencies

This project uses Node.js and npm, install them from here:
https://nodejs.org/

Then in the root of the repository, run npm to install the dependencies:

```
npm install
```

## Running the map generator

To generate the map, run the following command:

```
npm start -- --url <url-of-github-repo>
```

Where `url-of-github-repo` is a URL of the GitHub project web page or `https://github.com/...` or `git@github.com:...` URL you use to clone the repository.

So to generate a map for GitTerra itself you can run:

```
npm start -- --url https://github.com/GitTerraGame/GitTerra
```

or

```
npm start -- --url git@github.com:GitTerraGame/GitTerra.git
```
