.PHONY: all install build

all: build

install:
	npm install

build: install
	npm run build