#!/usr/bin/env bash

# Source this file

BASE="$(pwd)/$(dirname "${BASH_SOURCE[0]}")/../src"

d() {
    cd $( ${BASE}/index.js )
}
