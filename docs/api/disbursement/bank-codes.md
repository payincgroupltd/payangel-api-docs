---
id: bank-codes
title: Supported Bank Codes
sidebar_label: Bank Codes
slug: /api/disbursement/bank-codes
---

# Supported Bank Codes

When making disbursements to bank accounts, you need to provide the correct bank code for the recipient's bank. This page explains how to retrieve the list of supported bank codes for a specific country.

## Bank Codes API Endpoint

To get the list of supported bank codes for a specific country, use the following API endpoint:

```
GET https://api.payangel.com/api/v1/bankcodes/<ISO Country>
```

Replace `<ISO Country>` with the ISO country code (e.g., "gh" for Ghana, "ng" for Nigeria).

## Example Request

```
GET https://api.payangel.com/api/v1/bankcodes/gh
```

## Example Response

```json
{
  "country": "Ghana",
  "bankcodes": [
    { "bankCode": "300302", "bankName": "STANDARD CHARTERED BANK"},
    { "bankCode": "300309", "bankName": "UNIVERSAL MERCHANT BANK"}
  ]
}
```

## Usage

When making a disbursement transaction to a bank account, include the appropriate `bankCode` in your request payload. For example:

```javascript
{
  "transactionId": "PAY-123456789",
  "transferType": "Bank",
  "bankAccountNumber": "1234567890",
  "bankName": "STANDARD CHARTERED BANK",
  "bankBranch": "HIGH STREET",
  "bankCode": "300302",
  // ... other fields
}
```

## Supported Countries

Bank codes are available for the following countries:

- Ghana (gh)
- Nigeria (ng)
- Kenya (ke)
- South Africa (za)
- And other supported African countries

Use the country's ISO code in lowercase when making the API request to retrieve the bank codes.