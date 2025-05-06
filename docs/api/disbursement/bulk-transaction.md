---
id: bulk-transaction
title: Bulk Disbursement Transactions
sidebar_label: Bulk Transactions
slug: /api/disbursement/bulk-transaction
---

# Bulk Disbursement Transactions

This endpoint allows you to create multiple disbursement transactions in a single API call.

## Endpoint

```
POST https://api.payangel.com/v1/disbursements/bulk
```

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batch_reference` | string | Yes | Your unique reference for this batch |
| `source_account` | string | Yes | Your PayAngel account to debit |
| `transactions` | array | Yes | Array of transaction objects |
| `callback_url` | string | No | URL to receive status updates via webhook |

### Transaction Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reference` | string | Yes | Your unique reference for this transaction |
| `amount` | number | Yes | Amount to be transferred |
| `currency` | string | Yes | Currency code (e.g., GHS, NGN, USD) |
| `destination_type` | string | Yes | Type of destination (`bank_account`, `mobile_money`, `cash_pickup`) |
| `recipient` | object | Yes | Recipient information |
| `narration` | string | Yes | Purpose of the transfer |

### Recipient Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Recipient's full name |
| `email` | string | No | Recipient's email address |
| `phone` | string | Yes | Recipient's phone number |
| `address` | string | No | Recipient's physical address |
| `bank_code` | string | Conditional | Required for bank transfers |
| `account_number` | string | Conditional | Required for bank transfers |
| `mobile_network` | string | Conditional | Required for mobile money transfers |
| `mobile_number` | string | Conditional | Required for mobile money transfers |

## Response

### Success Response

```json
{
  "status": "success",
  "message": "Bulk transactions created successfully",
  "data": {
    "batch_id": "batch_123456789",
    "transactions": [
      {
        "transaction_id": "txn_123456789",
        "reference": "your-reference-1",
        "amount": 1000,
        "fee": 10,
        "total": 1010,
        "currency": "GHS",
        "status": "PENDING",
        "created_at": "2023-06-15T14:30:00Z",
        "estimated_delivery": "2023-06-15T15:30:00Z"
      },
      {
        "transaction_id": "txn_987654321",
        "reference": "your-reference-2",
        "amount": 500,
        "fee": 5,
        "total": 505,
        "currency": "GHS",
        "status": "PENDING",
        "created_at": "2023-06-15T14:30:00Z",
        "estimated_delivery": "2023-06-15T15:30:00Z"
      }
    ]
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Failed to create bulk transactions",
  "errors": [
    {
      "field": "transactions[0].recipient.account_number",
      "message": "Account number is invalid"
    }
  ]
}
```

## Example Requests

### JavaScript

```javascript
const axios = require('axios');

async function createBulkDisbursement() {
  try {
    const response = await axios.post('https://api.payangel.com/v1/disbursements/bulk', {
      batch_reference: `batch-${Date.now()}`,
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
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

createBulkDisbursement();
```

### TypeScript

```typescript
import axios from 'axios';

interface Recipient {
  name: string;
  email?: string;
  phone: string;
  bank_code?: string;
  account_number?: string;
  mobile_network?: string;
  mobile_number?: string;
}

interface Transaction {
  reference: string;
  amount: number;
  currency: string;
  destination_type: 'bank_account' | 'mobile_money' | 'cash_pickup';
  recipient: Recipient;
  narration: string;
}

interface BulkDisbursementRequest {
  batch_reference: string;
  source_account: string;
  callback_url?: string;
  transactions: Transaction[];
}

async function createBulkDisbursement() {
  try {
    const transactions: Transaction[] = [
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
    ];
    
    const requestData: BulkDisbursementRequest = {
      batch_reference: `batch-${Date.now()}`,
      source_account: 'acc_123456789',
      callback_url: 'https://your-website.com/webhooks/payangel',
      transactions
    };
    
    const response = await axios.post(
      'https://api.payangel.com/v1/disbursements/bulk',
      requestData,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createBulkDisbursement();
```

## Limitations

- Maximum of 500 transactions per batch
- All transactions must use the same source account
- All transactions must be created with a unique reference

## Best Practices

1. **Use Unique References**: Ensure each transaction in the batch has a unique reference to avoid duplication.
2. **Handle Partial Success**: Some transactions in a batch may succeed while others fail. Always check the status of each transaction.
3. **Webhook Integration**: Use webhooks to receive real-time updates about the status of each transaction in the batch.
4. **Pagination**: When retrieving large batches, use pagination to manage the response size.