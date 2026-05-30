#!/bin/bash
f=$(jq -r '.tool_input.file_path // ""')
echo "$f" | grep -qE '\.(ts|tsx)$' || exit 0
output=$(npx tsc --noEmit 2>&1)
if [ $? -ne 0 ]; then
  echo "$output"
  exit 2
fi
