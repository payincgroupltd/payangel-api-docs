---
id: examples
title: JavaScript Code Examples
sidebar_label: JavaScript Examples
slug: /api/javascript/examples
---

# JavaScript Code Examples

This section provides examples of how to use the PayAngel API with JavaScript.

## Prerequisites

- Node.js 12.x or higher
- npm or yarn package manager

## Installation

Install the required dependencies:

```bash
npm install axios
# or
yarn add axios
```

## Authentication

```javascript
const axios = require('axios');

// Configure API key
const API_KEY = 'your_api_key_here';

// Create axios instance with default headers
const payAngel = axios.create({
  baseURL: 'https://api.payangel.com/v1',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Test authentication
async function testConnection() {
  try {
    const response = await payAngel.get('/accounts');
    console.log('Connection successful!', response.data);
  } catch (error) {
    console.error('Authentication failed:', error.response?.data || error.message);
  }
}

testConnection();
```

## Get Account Balance

```javascript
async function getAccountBalance() {
  try {
    const response = await payAngel.get('/accounts/balance');
    console.log('Account Balance:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching balance:', error.response?.data || error.message);
    throw error;
  }
}

getAccountBalance();
```

## Single Disbursement

```javascript
async function createSingleDisbursement() {
  try {
    const disbursementData = {
      reference: `payment-${Date.now()}`, // Generate unique reference
      amount: 1000,
      currency: 'GHS',
      source_account: 'acc_123456789',
      destination_type: 'bank_account',
      recipient: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+233501234567',
        bank_code: 'GH123456',
        account_number: '1234567890'
      },
      narration: 'Salary payment',
      callback_url: 'https://your-website.com/webhooks/payangel'
    };
    
    const response = await payAngel.post('/disbursements/single', disbursementData);
    console.log('Disbursement created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating disbursement:', error.response?.data || error.message);
    throw error;
  }
}

createSingleDisbursement();
```

## Bulk Disbursement

```javascript
async function createBulkDisbursement() {
  try {
    const bulkData = {
      batch_reference: `batch-${Date.now()}`, // Generate unique batch reference
      source_account: 'acc_123456789',
      callback_url: 'https://your-website.com/webhooks/payangel',
      transactions: [
        {
          reference: `tx1-${Date.now()}`,
          amount: 1000,
          currency: 'GHS',
          destination_type: 'bank_account',
          recipient: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+233501234567',
            bank_code: 'GH123456',
            account_number: '1234567890'
          },
          narration: 'Salary payment'
        },
        {
          reference: `tx2-${Date.now()}`,
          amount: 500,
          currency: 'GHS',
          destination_type: 'mobile_money',
          recipient: {
            name: 'Jane Smith',
            phone: '+233507654321',
            mobile_network: 'MTN',
            mobile_number: '0507654321'
          },
          narration: 'Commission payment'
        }
      ]
    };
    
    const response = await payAngel.post('/disbursements/bulk', bulkData);
    console.log('Bulk disbursement created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating bulk disbursement:', error.response?.data || error.message);
    throw error;
  }
}

createBulkDisbursement();
```

## Check Transaction Status

```javascript
async function checkTransactionStatus(transactionId) {
  try {
    const response = await payAngel.get(`/disbursements/${transactionId}`);
    console.log('Transaction status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking status:', error.response?.data || error.message);
    throw error;
  }
}

checkTransactionStatus('txn_123456789');
```

## List Transactions

```javascript
async function listTransactions(page = 1, limit = 20) {
  try {
    const response = await payAngel.get('/disbursements', {
      params: {
        page,
        limit
      }
    });
    console.log('Transactions:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error listing transactions:', error.response?.data || error.message);
    throw error;
  }
}

listTransactions();
```

## Cancel Transaction

```javascript
async function cancelTransaction(transactionId) {
  try {
    const response = await payAngel.post(`/disbursements/${transactionId}/cancel`);
    console.log('Transaction cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling transaction:', error.response?.data || error.message);
    throw error;
  }
}

cancelTransaction('txn_123456789');
```

## Webhook Handler Example

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const WEBHOOK_SECRET = 'your_webhook_secret_here';

// Verify webhook signature
function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}

app.post('/webhooks/payangel', (req, res) => {
  const signature = req.headers['x-payangel-signature'];
  
  // Verify webhook signature
  if (!signature || !verifySignature(req.body, signature)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  const { event, data } = req.body;
  
  // Handle different event types
  switch (event) {
    case 'disbursement.pending':
      console.log('Transaction pending:', data.transaction_id);
      break;
    case 'disbursement.processing':
      console.log('Transaction processing:', data.transaction_id);
      break;
    case 'disbursement.completed':
      console.log('Transaction completed:', data.transaction_id);
      // Update your database or notify your users
      break;
    case 'disbursement.failed':
      console.log('Transaction failed:', data.transaction_id, data.failure_reason);
      // Handle the failure
      break;
    default:
      console.log('Unhandled event:', event);
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
```

## Complete NodeJS Project Structure

Here's a recommended project structure for a Node.js application using the PayAngel API:

```
payangel-integration/
├── .env                  # Environment variables
├── package.json
├── src/
│   ├── config.js         # Configuration and environment setup
│   ├── payangel/
│   │   ├── client.js     # PayAngel API client
│   │   ├── disbursement.js # Disbursement-specific methods
│   │   └── webhook.js    # Webhook handler
│   ├── server.js         # Express server for webhooks
│   └── index.js          # Main application entry point
└── test/
    └── payangel.test.js  # Tests for PayAngel integration
```

## Error Handling

```javascript
async function makeApiCall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          console.error('Authentication failed. Check your API key.');
          break;
        case 400:
          console.error('Invalid request:', error.response.data.message);
          break;
        case 429:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        case 500:
          console.error('PayAngel server error. Please try again later.');
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
    
    throw error;
  }
}

// Usage
makeApiCall(() => payAngel.get('/accounts/balance'))
  .then(data => console.log('Success:', data))
  .catch(() => console.log('Operation failed.'));
```