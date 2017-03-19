#!/bin/bash

CLEANUP_DRIVE=$(cd "$(dirname "$0")/"; pwd)"/_bin/cleanupdrive.sh";


cp "$CLEANUP_DRIVE" "/usr/bin/cleanupdrive";
chmod +x "/usr/bin/cleanupdrive";

