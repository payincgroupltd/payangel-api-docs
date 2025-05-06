---
id: overview
title: Disbursement API Overview
sidebar_label: Overview
slug: /api/disbursement/overview
---

# Disbursement API Overview

The PayAngel Disbursement API enables you to send money to recipients in various African countries. Whether you need to pay suppliers, reimburse expenses, or send remittances, our API provides a reliable and cost-effective solution.

## Key Features

- **Multiple Payout Methods**: Bank transfers, mobile money, and cash pickup
- **Real-time Status Updates**: Track the status of your transactions in real-time
- **Webhook Notifications**: Receive notifications when transaction statuses change
- **Bulk Processing**: Send multiple transactions in a single API call
- **Compliance Handling**: We handle all regulatory compliance requirements

## Disbursement Workflow

1. **Authentication**: Authenticate your request using your API key
2. **Transaction Creation**: Create a single or bulk transaction
3. **Processing**: PayAngel processes the transaction
4. **Status Updates**: Monitor the transaction status
5. **Completion**: Funds are delivered to the recipient

## Transaction Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | Transaction has been received and is pending processing |
| `PROCESSING` | Transaction is currently being processed |
| `COMPLETED` | Transaction has been successfully completed |
| `FAILED` | Transaction has failed |
| `CANCELLED` | Transaction has been cancelled |

## Payout Methods

The PayAngel API supports the following payout methods:

### Bank Transfer

Direct deposit to recipient's bank account.

### Mobile Money

Transfer to recipient's mobile money account.

Supported providers:
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- And more

### Cash Pickup

Recipients can collect cash at designated pickup locations.

## Supported Currencies

The PayAngel API supports transactions in the following currencies:

- GHS (Ghanaian Cedi)
- NGN (Nigerian Naira)
- KES (Kenyan Shilling)
- ZAR (South African Rand)
- USD (United States Dollar)
- EUR (Euro)
- GBP (British Pound)

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /disbursements/single` | Create a single disbursement transaction |
| `POST /disbursements/bulk` | Create multiple disbursement transactions |
| `GET /disbursements/{transaction_id}` | Get details of a specific transaction |
| `GET /disbursements` | List all disbursement transactions |
| `POST /disbursements/{transaction_id}/cancel` | Cancel a pending transaction |

## Rate Limits

Our API implements rate limiting to ensure the stability of the service. The current limits are:

- 100 requests per minute
- 5,000 requests per day

If you exceed these limits, your requests will receive a `429 Too Many Requests` response.