#!/bin/bash

APT_PAC=$(cd "$(dirname "$0")/"; pwd)"/_bin/autotagger.js";


cp "$APT_PAC" "/usr/bin/autotagger";
chmod +x "/usr/bin/autotagger";

