#!/usr/bin/env bash

set -euo pipefail

DOWNLOAD_DIR="${DOWNLOAD_DIR:-./models}"

mkdir -p "$DOWNLOAD_DIR"

download_model() {
	local name="$1"
	local url="$2"
	local output="${DOWNLOAD_DIR}/${name}"

	echo "========================================"
	echo "Downloading: $name"
	echo "Destination: $output"
	echo "========================================"

	if [[ -f "$output" ]]; then
		echo "File already exists, skipping:"
		echo "$output"
		return 0
	fi

	curl \
		--location \
		--fail \
		--retry 5 \
		--retry-delay 5 \
		--continue-at - \
		--progress-bar \
		--output "$output" \
		"$url";

	echo
	echo "Finished: $output"
	echo
}

# Qwen3-Next-80B-A3B-Instruct Q4_0
download_model "Qwen_Qwen3-Next-80B-A3B-Instruct-Q4_0.gguf" "https://huggingface.co/bartowski/Qwen_Qwen3-Next-80B-A3B-Instruct-GGUF/resolve/main/Qwen_Qwen3-Next-80B-A3B-Instruct-Q4_0.gguf?download=true";

# Huihui-Qwen3.6-35B-A3B-abliterated Q8_0
download_model "Huihui-Qwen3.6-35B-A3B-abliterated-Q8_0.gguf" "https://huggingface.co/Abiray/Huihui-Qwen3.6-35B-A3B-abliterated-GGUF/resolve/main/Huihui-Qwen3.6-35B-A3B-abliterated-Q8_0.gguf?download=true";

echo "All downloads complete.";

