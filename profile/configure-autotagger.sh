#!/bin/bash

file=$(cd "$(dirname "$0")/"; pwd)"/_bin/autotagger.js";


cp "$file" "/usr/bin/autotagger";
chmod +x "/usr/bin/autotagger";

