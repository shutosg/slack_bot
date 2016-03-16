#!/bin/sh

channel="#bot_test"
if [ $# -gt 1 ]; then
	cahnnel=$2
fi

curl -X POST https://slack.com/api/search.messages \
-d "token=発行した自分のトークン" \
-d "query=from:bot in:bot_test has::no_entry_sign:"
