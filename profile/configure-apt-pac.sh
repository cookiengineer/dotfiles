#!/bin/bash

file=$(cd "$(dirname "$0")/"; pwd)"/_bin/apt-pac.sh";


cp "$file" "/usr/bin/apt-pac";
chmod +x "/usr/bin/apt-pac";

