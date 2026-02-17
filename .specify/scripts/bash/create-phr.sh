#!/bin/bash

# PHR Creation Script
# Usage: ./create-phr.sh --title "title" --stage <stage> [--feature <name>] [--json]

TITLE=""
STAGE=""
FEATURE=""
JSON_OUTPUT=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --title)
      TITLE="$2"
      shift 2
      ;;
    --stage)
      STAGE="$2"
      shift 2
      ;;
    --feature)
      FEATURE="$2"
      shift 2
      ;;
    --json)
      JSON_OUTPUT=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [[ -z "$TITLE" ]] || [[ -z "$STAGE" ]]; then
  echo "Error: --title and --stage are required"
  exit 1
fi

# Generate ID
ID=$(date +%Y%m%d-%H%M%S)
DATE=$(date +%Y-%m-%d)

# Determine path based on stage
case $STAGE in
  constitution)
    DIR="history/prompts/constitution"
    ;;
  spec|plan|tasks|red|green|refactor|explainer|misc)
    if [[ -z "$FEATURE" ]]; then
      echo "Error: --feature required for feature stages"
      exit 1
    fi
    DIR="history/prompts/${FEATURE}"
    ;;
  general)
    DIR="history/prompts/general"
    ;;
  *)
    echo "Error: Unknown stage: $STAGE"
    exit 1
    ;;
esac

# Create directory if it doesn't exist
mkdir -p "$DIR"

# Generate output path
OUTPUT="${DIR}/${ID}-${TITLE// /_}.phr.md"

if [[ "$JSON_OUTPUT" == true ]]; then
  # Output JSON with path
  echo "{\"id\": \"$ID\", \"path\": \"$OUTPUT\", \"stage\": \"$STAGE\", \"title\": \"$TITLE\", \"date\": \"$DATE\"}"
else
  # Output simple
  echo "$ID|$OUTPUT|$STAGE|$TITLE|$DATE"
fi

exit 0
