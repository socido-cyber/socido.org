#!/usr/bin/env bash
# Socido Website — Local Preview Server
PORT=8000
echo "======================================================="
echo " Starting Socido Website preview at: http://localhost:$PORT"
echo " Press Ctrl+C in this terminal to stop the server."
echo "======================================================="

# Open browser after a brief delay
(sleep 1 && open "http://localhost:$PORT") &

# Start Python HTTP Server
python3 -m http.server $PORT
