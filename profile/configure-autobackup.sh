#!/bin/bash

file=$(cd "$(dirname "$0")/"; pwd)"/_bin/autobackup.sh";


cp "$file" "/usr/bin/autobackup";
chmod +x "/usr/bin/autobackup";

