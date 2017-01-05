#!/bin/bash

APT_PAC=$(cd "$(dirname "$0")/"; pwd)"/_bin/apt-pac.sh";


cp "$APT_PAC" "/usr/bin/apt-pac";
chmod +x "/usr/bin/apt-pac";

