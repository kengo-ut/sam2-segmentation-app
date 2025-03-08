#!/bin/bash

CURRENT_DIR=$(basename "$PWD")

if [ "$CURRENT_DIR" != "back" ]; then
    echo "Error: This script must be run from the 'back' directory."
    exit 1
fi

echo "Executing script in 'back' directory..."

# install packages
uv sync

# download checkpoints
cd checkpoints/
./download_ckpts.sh
cd ../
