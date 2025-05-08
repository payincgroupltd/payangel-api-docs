---
id: overview
title: Collection API Overview
sidebar_label: Overview
---

# Collection API

The Collections API enables PayAngel merchants to perform fund collection from different providers based on the country. Currently, collections is only supported via MTN, Telecel and AT Ghana. All collected funds are deposited into the merchant business wallet for the corresponding currency.

## Base URL

All endpoints are under the base path: `/api/v1/middleware`

## Supported Collection Methods

PayAngel's Collection API currently supports the following payment methods:

1. **Mobile Money (MOMO)** - Available in Ghana
2. **Card Collections** - For debit and credit card payments
3. **Bank Collections** - Coming soon

## Collection Process Flow

1. Your system initiates a collection request to PayAngel
2. PayAngel processes the request with the appropriate payment provider
3. The customer completes the payment on their device (for MOMO) or through a payment interface
4. PayAngel sends a callback notification to your system with the transaction result
5. Funds are deposited into your PayAngel business wallet

## Prerequisites

Before using the Collection API:

1. Set up your callback URLs in the business.payangel.com portal under Channels/TradeName
2. Ensure your PayAngel account is configured for the collection methods you intend to use