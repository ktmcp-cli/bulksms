![Banner](https://raw.githubusercontent.com/ktmcp-cli/bulksms/main/banner.svg)

> "Six months ago, everyone was talking about MCPs. And I was like, screw MCPs. Every MCP would be better as a CLI."
>
> — [Peter Steinberger](https://twitter.com/steipete), Founder of OpenClaw
> [Watch on YouTube (~2:39:00)](https://www.youtube.com/@lexfridman) | [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/)

# BulkSMS CLI

> **⚠️ Unofficial CLI** - Not officially sponsored or affiliated with BulkSMS.

Send SMS messages, manage your message history, and check your account balance from the command line using the BulkSMS JSON REST API.

## Installation
```bash
npm install -g @ktmcp-cli/bulksms
```

## Quick Start
```bash
bulksms config set --username YOUR_USERNAME --password YOUR_PASSWORD
bulksms send --to +27001234567 --body "Hello from the CLI!"
bulksms profile balance
```

Get your API credentials from: https://www.bulksms.com/account/

## Commands

### Configuration
```bash
bulksms config set --username USER --password PASS
bulksms config show
```

### Send Messages
```bash
bulksms send --to +27001234567 --body "Hello World!"
bulksms send --to +27001234567 --body "Привет!" --unicode
bulksms send --to +27001234567 --body "Test" --from "MySender"
```

### Manage Messages
```bash
bulksms messages list                # List all messages
bulksms messages sent --limit 50     # List sent messages
bulksms messages received            # List received messages
bulksms messages get <messageId>     # Get message details
bulksms messages status <messageId>  # Check message status
```

### Profile
```bash
bulksms profile show      # View account profile
bulksms profile balance   # Check credit balance
```

### Webhooks
```bash
bulksms webhooks list
bulksms webhooks create --url https://example.com/webhook --name "My Webhook"
```

### Groups
```bash
bulksms groups  # List contact groups
```

## Authentication

BulkSMS uses HTTP Basic Authentication. You can use either:
- Your account username and password
- A token ID and token secret (recommended for API access)

## Why CLI > MCP?
No server to run. No protocol overhead. Just install and go.

## License
MIT — Part of the [Kill The MCP](https://killthemcp.com) project.


---

## Support KTMCP

If you find this CLI useful, we'd greatly appreciate your support! Share your experience on:
- Reddit
- Twitter/X
- Hacker News

**Incentive:** Users who can demonstrate that their support/advocacy helped advance KTMCP will have their feature requests and issues prioritized.

Just be mindful - these are real accounts and real communities. Authentic mentions and genuine recommendations go a long way!

## Support This Project

If you find this CLI useful, we'd appreciate support across Reddit, Twitter, Hacker News, or Moltbook. Please be mindful - these are real community accounts. Contributors who can demonstrate their support helped advance KTMCP will have their PRs and feature requests prioritized.
