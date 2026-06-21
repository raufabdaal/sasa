#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Sasa · launch.sh
# One-command local launcher. Run from the sasa/ folder.
# ─────────────────────────────────────────────────────────────

set -e

# Colors for friendlier output
BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${CYAN}Sasa${NC}  ${DIM}— local launcher${NC}"
echo ""

# ── Resolve script directory so this works from anywhere ──────
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
APP_DIR="$SCRIPT_DIR/app"

if [ ! -d "$APP_DIR" ]; then
  echo -e "${RED}✗ Could not find app/ folder at: $APP_DIR${NC}"
  echo -e "${DIM}  Make sure you're running this from inside the sasa/ project root.${NC}"
  exit 1
fi

# ── Check Node ────────────────────────────────────────────────
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js is not installed.${NC}"
  echo -e "  Install it from ${BOLD}https://nodejs.org${NC} (LTS version, v20+)"
  echo -e "  Then run this script again."
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo -e "${YELLOW}⚠ Node.js v$NODE_MAJOR detected. Sasa needs v20 or newer.${NC}"
  echo -e "  Update from ${BOLD}https://nodejs.org${NC} and try again."
  exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js $(node -v)"

# ── Check pnpm ────────────────────────────────────────────────
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}⚠ pnpm is not installed. Installing now...${NC}"
  npm install -g pnpm
  if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm install failed.${NC}"
    echo -e "  Try manually: ${BOLD}npm install -g pnpm${NC}"
    echo -e "  (On macOS you may need: ${BOLD}sudo npm install -g pnpm${NC} or ${BOLD}brew install pnpm${NC})"
    exit 1
  fi
fi
echo -e "  ${GREEN}✓${NC} pnpm $(pnpm -v)"

# ── Install dependencies if needed ────────────────────────────
cd "$APP_DIR"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.modules.yaml" ]; then
  echo ""
  echo -e "${BOLD}Installing dependencies${NC} ${DIM}(first-time only, ~30 seconds)...${NC}"
  pnpm install
  echo ""
fi

# ── Start ─────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}Starting Sasa...${NC}"
echo ""
echo -e "  ${BOLD}→ Open http://localhost:3000 in your browser${NC}"
echo ""
echo -e "  ${DIM}Press Ctrl+C to stop the server.${NC}"
echo ""

exec pnpm dev
