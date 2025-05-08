---
id: introduction
title: PayAngel API Introduction
sidebar_label: Introduction
slug: /api/introduction
---

# PayAngel API

Welcome to the PayAngel API documentation. Our API offers two main services:

1. **Disbursement API**: Send money to recipients in various countries quickly and efficiently.
2. **Collection API**: Accept payments from customers through multiple channels including mobile money and card payments.

## API Base URL

```
https://api.payangel.com/v1
```

## Authentication

All API requests require authentication using API keys. You can obtain your API keys from the PayAngel Developer Dashboard.

[Learn more about authentication →](authentication.md)

## How It Works

Whenever you submit a request through our API, we will intelligently select the most suitable provider to fulfill the request. This selection is based on factors like cost-effectiveness, speed, and reliability of the providers. Our system keeps track of the provider used to fulfill your request, making it easy for you to query transaction status in the future.

## Features

### Disbursement
- **Single Transactions**: Send money to individual recipients
- **Bulk Transactions**: Process multiple payments in a single request

### Collection
- **Mobile Money**: Accept payments via various mobile money platforms
- **Card Payments**: Process card payments securely

### Common Features
- **Status Tracking**: Monitor the status of your transactions
- **Webhooks**: Receive real-time updates about payment status changes

## Getting Started

To get started with the PayAngel API:

1. [Create a PayAngel account](https://business.payangel.com)
   - Note: When the account is created, a Know Your Business (KYB) compliance process will be completed before the account is active for use.
2. Set up your callback URLs in the business.payangel.com portal under Channels/TradeName
3. Generate API keys in the Developer Dashboard
4. Start sending test transactions in the sandbox environment

Currently, only direct API calls are supported. SDK integrations are planned for future releases.

## Supported Countries

The PayAngel API currently supports operations in the following countries:

- Ghana
- Nigeria
- Kenya
- South Africa
- And many more African countries

## Support

If you need assistance with the API, please contact our developer support team at [developers@payangel.com](mailto:developers@payangel.com).