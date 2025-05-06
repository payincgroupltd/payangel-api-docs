---
id: examples
title: TypeScript Code Examples
sidebar_label: TypeScript Examples
slug: /api/typescript/examples
---

# TypeScript Code Examples

This section provides examples of how to use the PayAngel API with TypeScript.

## Prerequisites

- Node.js 12.x or higher
- npm or yarn package manager
- TypeScript 4.x or higher

## Installation

Install the required dependencies:

```bash
npm install axios typescript @types/node
# or
yarn add axios typescript @types/node
```

## TypeScript Configuration

Create a `tsconfig.json` file in the root of your project:

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

## Type Definitions

First, let's define TypeScript interfaces for the PayAngel API:

```typescript
// src/types/payangel.ts

export interface Recipient {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  bank_code?: string;
  account_number?: string;
  mobile_network?: string;
  mobile_number?: string;
}

export type DestinationType = 'bank_account' | 'mobile_money' | 'cash_pickup';

export interface SingleDisbursementRequest {
  reference: string;
  amount: number;
  currency: string;
  source_account: string;
  destination_type: DestinationType;
  recipient: Recipient;
  narration: string;
  callback_url?: string;
}

export interface Transaction {
  reference: string;
  amount: number;
  currency: string;
  destination_type: DestinationType;
  recipient: Recipient;
  narration: string;
}

export interface BulkDisbursementRequest {
  batch_reference: string;
  source_account: string;
  callback_url?: string;
  transactions: Transaction[];
}

export interface TransactionResponse {
  transaction_id: string;
  reference: string;
  amount: number;
  fee: number;
  total: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  created_at: string;
  estimated_delivery: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: {
    field: string;
    message: string;
  }[];
}
```

## PayAngel API Client

Create a typed API client for PayAngel:

```typescript
// src/services/payangel-client.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ApiResponse,
  SingleDisbursementRequest,
  BulkDisbursementRequest,
  TransactionResponse
} from '../types/payangel';

export class PayAngelClient {
  private client: AxiosInstance;
  
  constructor(apiKey: string, baseURL: string = 'https://api.payangel.com/v1') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Get account balance
  async getAccountBalance(): Promise<ApiResponse<{ available: number; currency: string }>> {
    const response: AxiosResponse<ApiResponse<{ available: number; currency: string }>> = 
      await this.client.get('/accounts/balance');
    return response.data;
  }
  
  // Create a single disbursement
  async createSingleDisbursement(data: SingleDisbursementRequest): Promise<ApiResponse<TransactionResponse>> {
    const response: AxiosResponse<ApiResponse<TransactionResponse>> = 
      await this.client.post('/disbursements/single', data);
    return response.data;
  }
  
  // Create a bulk disbursement
  async createBulkDisbursement(data: BulkDisbursementRequest): Promise<ApiResponse<{ batch_id: string; transactions: TransactionResponse[] }>> {
    const response: AxiosResponse<ApiResponse<{ batch_id: string; transactions: TransactionResponse[] }>> = 
      await this.client.post('/disbursements/bulk', data);
    return response.data;
  }
  
  // Get transaction status
  async getTransactionStatus(transactionId: string): Promise<ApiResponse<TransactionResponse>> {
    const response: AxiosResponse<ApiResponse<TransactionResponse>> = 
      await this.client.get(`/disbursements/${transactionId}`);
    return response.data;
  }
  
  // List transactions
  async listTransactions(page: number = 1, limit: number = 20): Promise<ApiResponse<{ 
    total: number; 
    page: number; 
    limit: number; 
    transactions: TransactionResponse[] 
  }>> {
    const response: AxiosResponse<ApiResponse<{ 
      total: number; 
      page: number; 
      limit: number; 
      transactions: TransactionResponse[] 
    }>> = await this.client.get('/disbursements', {
      params: { page, limit }
    });
    return response.data;
  }
  
  // Cancel a transaction
  async cancelTransaction(transactionId: string): Promise<ApiResponse<{ status: string }>> {
    const response: AxiosResponse<ApiResponse<{ status: string }>> = 
      await this.client.post(`/disbursements/${transactionId}/cancel`);
    return response.data;
  }
}
```

## Usage Examples

### Initialize the Client

```typescript
// src/index.ts

import { PayAngelClient } from './services/payangel-client';
import { SingleDisbursementRequest, BulkDisbursementRequest } from './types/payangel';

// Initialize the client
const API_KEY = process.env.PAYANGEL_API_KEY || 'your_api_key_here';
const client = new PayAngelClient(API_KEY);

// For sandbox environment
// const client = new PayAngelClient(API_KEY, 'https://sandbox-api.payangel.com/v1');

async function main() {
  try {
    // Your code here
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Check Account Balance

```typescript
async function checkBalance() {
  try {
    const balanceResponse = await client.getAccountBalance();
    
    if (balanceResponse.status === 'success' && balanceResponse.data) {
      console.log(`Available Balance: ${balanceResponse.data.available} ${balanceResponse.data.currency}`);
      return balanceResponse.data;
    } else {
      console.error('Failed to get balance:', balanceResponse.message);
      return null;
    }
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
}
```

### Create a Single Disbursement

```typescript
import { SingleDisbursementRequest, DestinationType } from './types/payangel';

async function createBankTransfer() {
  try {
    const disbursementData: SingleDisbursementRequest = {
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
    
    const response = await client.createSingleDisbursement(disbursementData);
    
    if (response.status === 'success' && response.data) {
      console.log('Disbursement created successfully');
      console.log('Transaction ID:', response.data.transaction_id);
      console.log('Status:', response.data.status);
      return response.data;
    } else {
      console.error('Failed to create disbursement:', response.message);
      if (response.errors) {
        response.errors.forEach(error => {
          console.error(`- ${error.field}: ${error.message}`);
        });
      }
      return null;
    }
  } catch (error) {
    console.error('Error creating disbursement:', error);
    throw error;
  }
}
```

### Create a Bulk Disbursement

```typescript
import { BulkDisbursementRequest, Transaction } from './types/payangel';

async function createBulkTransfer() {
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
    
    const bulkData: BulkDisbursementRequest = {
      batch_reference: `batch-${Date.now()}`,
      source_account: 'acc_123456789',
      callback_url: 'https://your-website.com/webhooks/payangel',
      transactions
    };
    
    const response = await client.createBulkDisbursement(bulkData);
    
    if (response.status === 'success' && response.data) {
      console.log('Bulk disbursement created successfully');
      console.log('Batch ID:', response.data.batch_id);
      console.log('Transactions:', response.data.transactions.length);
      return response.data;
    } else {
      console.error('Failed to create bulk disbursement:', response.message);
      if (response.errors) {
        response.errors.forEach(error => {
          console.error(`- ${error.field}: ${error.message}`);
        });
      }
      return null;
    }
  } catch (error) {
    console.error('Error creating bulk disbursement:', error);
    throw error;
  }
}
```

### Check Transaction Status

```typescript
async function checkTransactionStatus(transactionId: string) {
  try {
    const response = await client.getTransactionStatus(transactionId);
    
    if (response.status === 'success' && response.data) {
      console.log('Transaction Status:', response.data.status);
      console.log('Transaction Details:', response.data);
      return response.data;
    } else {
      console.error('Failed to get transaction status:', response.message);
      return null;
    }
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
}
```

### List Transactions

```typescript
async function listTransactions(page: number = 1, limit: number = 20) {
  try {
    const response = await client.listTransactions(page, limit);
    
    if (response.status === 'success' && response.data) {
      console.log(`Showing ${response.data.transactions.length} of ${response.data.total} transactions`);
      response.data.transactions.forEach(tx => {
        console.log(`- ${tx.transaction_id}: ${tx.amount} ${tx.currency} (${tx.status})`);
      });
      return response.data;
    } else {
      console.error('Failed to list transactions:', response.message);
      return null;
    }
  } catch (error) {
    console.error('Error listing transactions:', error);
    throw error;
  }
}
```

### Webhook Handler (Express.js)

```typescript
// src/webhook-server.ts

import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());

const WEBHOOK_SECRET = process.env.PAYANGEL_WEBHOOK_SECRET || 'your_webhook_secret_here';

interface WebhookPayload {
  event: string;
  data: {
    transaction_id: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    failure_reason?: string;
    [key: string]: any;
  };
}

// Verify webhook signature
function verifySignature(payload: any, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}

app.post('/webhooks/payangel', (req, res) => {
  const signature = req.headers['x-payangel-signature'] as string;
  
  // Verify webhook signature
  if (!signature || !verifySignature(req.body, signature)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  const { event, data } = req.body as WebhookPayload;
  
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
```

## Error Handling

```typescript
// src/utils/error-handler.ts

import { AxiosError } from 'axios';
import { ApiResponse } from '../types/payangel';

export class PayAngelError extends Error {
  status?: number;
  response?: ApiResponse<any>;
  
  constructor(message: string, status?: number, response?: ApiResponse<any>) {
    super(message);
    this.name = 'PayAngelError';
    this.status = status;
    this.response = response;
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = axiosError.response.status;
      const data = axiosError.response.data;
      
      // Handle specific error codes
      switch (status) {
        case 401:
          throw new PayAngelError('Authentication failed. Check your API key.', status, data);
        case 400:
          throw new PayAngelError(`Invalid request: ${data.message}`, status, data);
        case 429:
          throw new PayAngelError('Rate limit exceeded. Please try again later.', status, data);
        case 500:
          throw new PayAngelError('PayAngel server error. Please try again later.', status, data);
        default:
          throw new PayAngelError(`API error: ${data.message}`, status, data);
      }
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new PayAngelError('No response received from server. Check your connection.', undefined);
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new PayAngelError(`Request error: ${axiosError.message}`, undefined);
    }
  }
  
  // Not an Axios error
  if (error instanceof Error) {
    throw new PayAngelError(`Unexpected error: ${error.message}`, undefined);
  }
  
  throw new PayAngelError('Unknown error occurred', undefined);
}

// Usage
try {
  // API call here
} catch (error) {
  handleApiError(error);
}
```

## Complete Project Structure

Here's a recommended project structure for a TypeScript application using the PayAngel API:

```
payangel-integration/
├── .env                      # Environment variables
├── package.json
├── tsconfig.json             # TypeScript configuration
├── src/
│   ├── index.ts              # Main application entry point
│   ├── config.ts             # Configuration and environment setup
│   ├── types/
│   │   └── payangel.ts       # PayAngel API type definitions
│   ├── services/
│   │   └── payangel-client.ts # PayAngel API client
│   ├── utils/
│   │   └── error-handler.ts  # Error handling utilities
│   └── webhook-server.ts     # Express server for webhooks
└── test/
    └── payangel.test.ts      # Tests for PayAngel integration
```