# BulkSMS CLI - Agent Instructions

This is the BulkSMS CLI, part of the KTMCP project.

## What This CLI Does
- Send SMS messages via BulkSMS API
- List sent and received messages
- Check message delivery status
- View account profile and credit balance
- Manage webhooks and contact groups

## Authentication
Uses HTTP Basic Auth with username/password or token ID/secret.

## Common Commands
- `bulksms config set --username USER --password PASS` - Configure credentials
- `bulksms send --to +NUMBER --body "TEXT"` - Send SMS
- `bulksms messages list` - List messages
- `bulksms profile balance` - Check credits
- `bulksms webhooks list` - List webhooks

## API Reference
https://www.bulksms.com/developer/json/v1/
