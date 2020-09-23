#!/bin/bash

tmux new-session -s author -d

tmux select-pane -T eq-publisher
tmux send-keys "cd eq-publisher; docker-compose up" Enter
tmux split-window -v
tmux select-pane -T eq-author
tmux send-keys "bash" Enter
tmux send-keys "cd eq-author; nvm use 10; yarn start" Enter
tmux split-window -v
tmux select-pane -T eq-author-api
tmux send-keys "cd eq-author-api; docker-compose up" Enter

tmux set pane-border-status top

tmux attach
