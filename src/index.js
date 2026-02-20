import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { getConfig, setConfig, isConfigured } from './config.js';
import { sendMessage, listMessages, getMessage, getMessageStatus, getSentMessages, getReceivedMessages, getProfile, getCreditBalance, listWebhooks, createWebhook, listGroups } from './api.js';

const program = new Command();

program
  .name('bulksms')
  .description('CLI for BulkSMS JSON REST API - send SMS, manage messages and check account')
  .version('1.0.0');

// Config command
const config = program.command('config');
config.command('set')
  .description('Configure API credentials')
  .option('--username <username>', 'BulkSMS username (or tokenId)')
  .option('--password <password>', 'BulkSMS password (or token secret)')
  .action((opts) => {
    if (opts.username) setConfig('username', opts.username);
    if (opts.password) setConfig('password', opts.password);
    console.log(chalk.green('✓ Configuration saved'));
  });

config.command('show')
  .description('Show current configuration')
  .action(() => {
    const username = getConfig('username');
    const password = getConfig('password');
    console.log(chalk.bold('Current config:'));
    console.log(`  Username: ${username ? chalk.green(username) : chalk.red('not set')}`);
    console.log(`  Password: ${password ? chalk.green('****') : chalk.red('not set')}`);
  });

// Send command
program.command('send')
  .description('Send an SMS message')
  .requiredOption('--to <number>', 'Recipient phone number (E.164 format: +27001234567)')
  .requiredOption('--body <text>', 'Message body')
  .option('--from <number>', 'Sender number or name')
  .option('--unicode', 'Use unicode encoding')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Sending message...').start();
    try {
      const payload = { to: opts.to, body: opts.body };
      if (opts.from) payload.from = opts.from;
      if (opts.unicode) payload.encoding = 'UNICODE';
      const data = await sendMessage(payload);
      spinner.succeed('Message sent');
      console.log(chalk.green(`Message ID: ${data.id || data[0]?.id}`));
      console.log(`Status: ${data.status?.type || data[0]?.status?.type || 'SENT'}`);
    } catch (e) {
      spinner.fail('Failed to send message');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

// Messages commands
const messages = program.command('messages').description('Manage messages');

messages.command('list')
  .description('List all messages')
  .option('--limit <n>', 'Number of messages to retrieve', '100')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching messages...').start();
    try {
      const data = await listMessages({ limit: opts.limit });
      spinner.succeed('Messages fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No messages found'));
      data.forEach(msg => {
        console.log(`${chalk.cyan(msg.id)} | To: ${msg.to} | ${msg.body.substring(0, 50)}${msg.body.length > 50 ? '...' : ''} | ${msg.status?.type || 'UNKNOWN'}`);
      });
    } catch (e) {
      spinner.fail('Failed to fetch messages');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

messages.command('sent')
  .description('List sent messages')
  .option('--limit <n>', 'Number of messages', '50')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching sent messages...').start();
    try {
      const data = await getSentMessages({ limit: opts.limit });
      spinner.succeed('Sent messages fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No sent messages found'));
      data.forEach(msg => {
        console.log(`${chalk.cyan(msg.id)} | To: ${msg.to} | ${msg.body.substring(0, 40)} | ${msg.status?.type}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

messages.command('received')
  .description('List received messages')
  .option('--limit <n>', 'Number of messages', '50')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching received messages...').start();
    try {
      const data = await getReceivedMessages({ limit: opts.limit });
      spinner.succeed('Received messages fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No received messages found'));
      data.forEach(msg => {
        console.log(`${chalk.cyan(msg.id)} | From: ${msg.from} | ${msg.body.substring(0, 40)}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

messages.command('get <messageId>')
  .description('Get details of a specific message')
  .action(async (messageId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching message...').start();
    try {
      const data = await getMessage(messageId);
      spinner.succeed('Message details');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

messages.command('status <messageId>')
  .description('Get status of a message')
  .action(async (messageId) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching status...').start();
    try {
      const data = await getMessageStatus(messageId);
      spinner.succeed('Status fetched');
      console.log(`Status: ${chalk.green(data.type || 'UNKNOWN')}`);
      if (data.subtype) console.log(`Subtype: ${data.subtype}`);
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

// Profile commands
const profile = program.command('profile').description('View account profile');

profile.command('show')
  .description('Show account profile')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching profile...').start();
    try {
      const data = await getProfile();
      spinner.succeed('Profile fetched');
      console.log(JSON.stringify(data, null, 2));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

profile.command('balance')
  .description('Check credit balance')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching balance...').start();
    try {
      const data = await getCreditBalance();
      spinner.succeed('Balance fetched');
      console.log(chalk.green(`Credits: ${data.balance || 0}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

// Webhooks commands
const webhooks = program.command('webhooks').description('Manage webhooks');

webhooks.command('list')
  .description('List webhooks')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching webhooks...').start();
    try {
      const data = await listWebhooks();
      spinner.succeed('Webhooks fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No webhooks found'));
      data.forEach(wh => {
        console.log(`${chalk.cyan(wh.id)} | URL: ${wh.url} | Active: ${wh.active}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

webhooks.command('create')
  .description('Create a webhook')
  .requiredOption('--url <url>', 'Webhook URL')
  .option('--name <name>', 'Webhook name')
  .action(async (opts) => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Creating webhook...').start();
    try {
      const payload = { url: opts.url };
      if (opts.name) payload.name = opts.name;
      const data = await createWebhook(payload);
      spinner.succeed('Webhook created');
      console.log(chalk.green(`Webhook ID: ${data.id}`));
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

// Groups command
program.command('groups')
  .description('List contact groups')
  .action(async () => {
    if (!isConfigured()) return console.error(chalk.red('Run: bulksms config set --username USER --password PASS'));
    const spinner = ora('Fetching groups...').start();
    try {
      const data = await listGroups();
      spinner.succeed('Groups fetched');
      if (!data || data.length === 0) return console.log(chalk.yellow('No groups found'));
      data.forEach(grp => {
        console.log(`${chalk.cyan(grp.id)} | ${chalk.bold(grp.name)} | Members: ${grp.numberOfContacts || 0}`);
      });
    } catch (e) {
      spinner.fail('Failed');
      console.error(chalk.red(e.response?.data?.detail || e.message));
    }
  });

program.parse(process.argv);
