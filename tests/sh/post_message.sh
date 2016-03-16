#!/bin/sh

channel="#bot_test"
if [ $# -gt 1 ]; then
	cahnnel=$2
fi

curl -X POST https://slack.com/api/chat.postMessage \
-d "token=投稿者のトークン" \
-d "channel=$channel" \
-d "text=$1" \
