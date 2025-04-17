#!/bin/bash

# Create a new tmux session named 'dev'
tmux new-session -d -s dev

# Split the window into two panes
tmux split-window -h

# Send commands to the panes
tmux send-keys -t dev:0.0 'cd ~/Documents/DEV\ SOLUTIONS/repos/studio && npm run dev' C-m
tmux send-keys -t dev:0.1 'cd ~/Documents/DEV\ SOLUTIONS/repos/studio' C-m

# Attach to the session
tmux attach-session -t dev 