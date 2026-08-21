#!/usr/bin/env bash
set -euo pipefail

# Qwen3-Next-80B-A3B via llama.cpp
#
# Hardware target:
#   - 96 GB system RAM
#   - 48 GB AMD GPU VRAM
#
# Goal:
#   - Q4 model
#   - 512K context
#   - K-cache: Q4
#   - V-cache: FP16
#
# IMPORTANT:
#   512K context is a high-memory configuration. Start with the values below,
#   then reduce context / batch sizes if llama-server fails during initialization.

MODEL="/models/Qwen3-Next-80B-A3B-Q4_K_M.gguf"

# ---------------------------------------------------------------------------
# Context
# ---------------------------------------------------------------------------

# -c 524288
# Maximum context window: 512K tokens.
#
# If initialization fails due to insufficient memory, try:
#
#   -c 262144    # 256K
#   -c 131072    # 128K
#   -c 65536     # 64K
#
# For troubleshooting, start at 64K and increase until you find the limit.
CONTEXT=524288


# ---------------------------------------------------------------------------
# GPU layer offloading
# ---------------------------------------------------------------------------

# -ngl 999
# Request that llama.cpp offload as many model layers as possible to the GPU.
#
# 999 is conventionally used to mean "all layers".
#
# llama.cpp will determine how many layers actually fit in VRAM.
#
# If GPU initialization fails, try lowering this value:
#
#   -ngl 80
#   -ngl 60
#   -ngl 40
#
# However, with a 48 GB GPU, -ngl 999 is normally the first thing to try.
N_GPU_LAYERS=999


# ---------------------------------------------------------------------------
# KV cache quantization
# ---------------------------------------------------------------------------

# -ctk q4_0
# Store the attention K (key) cache using Q4_0.
#
# This substantially reduces KV-cache memory at very large context sizes.
#
# If you encounter:
#   - numerical instability
#   - degraded output quality
#   - unsupported quantization errors
#
# try:
#
#   -ctk f16
#
# This increases memory consumption.
K_CACHE="q4_0"


# -ctv f16
# Store the attention V (value) cache as FP16.
#
# FP16 is the conservative/default-quality choice.
V_CACHE="f16"


# ---------------------------------------------------------------------------
# Flash Attention
# ---------------------------------------------------------------------------

# -fa on
# Enable Flash Attention.
#
# This is particularly important for large context windows because it can
# substantially reduce attention memory usage and improve performance.
#
# If your AMD backend/build reports that Flash Attention is unsupported,
# try:
#
#   -fa off
#
# But for a 512K context, keeping Flash Attention enabled is preferable
# if your llama.cpp backend supports it.
FLASH_ATTENTION="on"


# ---------------------------------------------------------------------------
# Logical batch size
# ---------------------------------------------------------------------------

# -b 2048
# Maximum number of tokens processed together during prompt processing.
#
# Larger values can improve prompt-processing throughput but require more
# memory.
#
# If you run out of VRAM/RAM during prompt processing, try:
#
#   -b 1024
#   -b 512
#   -b 256
#
# For a 512K context, 2048 is a reasonable starting point.
BATCH_SIZE=2048


# ---------------------------------------------------------------------------
# Physical microbatch size
# ---------------------------------------------------------------------------

# -ub 512
# Physical batch/microbatch size used during computation.
#
# Lower values reduce peak GPU memory consumption at the cost of throughput.
#
# If initialization or inference runs out of VRAM, try:
#
#   -ub 256
#   -ub 128
#   -ub 64
#
# Keep -ub <= -b.
UBATCH_SIZE=512


# ---------------------------------------------------------------------------
# Network
# ---------------------------------------------------------------------------

# --host 0.0.0.0
# Listen on all network interfaces.
#
# WARNING:
# This exposes the HTTP server to other machines that can reach this host.
#
# For local-only access, use:
#
#   --host 127.0.0.1
HOST="0.0.0.0"


# --port 8080
# HTTP API port.
PORT=8080


# ---------------------------------------------------------------------------
# Start llama-server
# ---------------------------------------------------------------------------

exec llama-server \
    -m "$MODEL" \
    -ngl "$N_GPU_LAYERS" \
    -c "$CONTEXT" \
    -ctk "$K_CACHE" \
    -ctv "$V_CACHE" \
    -fa "$FLASH_ATTENTION" \
    -b "$BATCH_SIZE" \
    -ub "$UBATCH_SIZE" \
    --host "$HOST" \
    --port "$PORT";

