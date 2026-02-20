import axios from 'axios';
import { getConfig } from './config.js';

const BASE_URL = 'https://api.bulksms.com/v1';

function getClient() {
  const username = getConfig('username');
  const password = getConfig('password');
  return axios.create({
    baseURL: BASE_URL,
    auth: { username, password },
    headers: { 'Content-Type': 'application/json' }
  });
}

// Messages
export async function sendMessage(options) {
  const client = getClient();
  const res = await client.post('/messages', options);
  return res.data;
}

export async function listMessages(params = {}) {
  const client = getClient();
  const res = await client.get('/messages', { params });
  return res.data;
}

export async function getMessage(messageId) {
  const client = getClient();
  const res = await client.get(`/messages/${messageId}`);
  return res.data;
}

export async function getMessageStatus(messageId) {
  const client = getClient();
  const res = await client.get(`/messages/${messageId}/status`);
  return res.data;
}

export async function getSentMessages(params = {}) {
  const client = getClient();
  const res = await client.get('/messages/sent', { params });
  return res.data;
}

export async function getReceivedMessages(params = {}) {
  const client = getClient();
  const res = await client.get('/messages/received', { params });
  return res.data;
}

// Profile
export async function getProfile() {
  const client = getClient();
  const res = await client.get('/profile');
  return res.data;
}

export async function getCreditBalance() {
  const client = getClient();
  const res = await client.get('/profile/credit-balance');
  return res.data;
}

// Webhooks
export async function listWebhooks() {
  const client = getClient();
  const res = await client.get('/webhooks');
  return res.data;
}

export async function createWebhook(options) {
  const client = getClient();
  const res = await client.post('/webhooks', options);
  return res.data;
}

// Groups
export async function listGroups() {
  const client = getClient();
  const res = await client.get('/groups');
  return res.data;
}
