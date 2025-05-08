---
id: mobile-money
title: Mobile Money Collection
sidebar_label: Mobile Money
---

# Mobile Money Collection

This endpoint allows you to initiate collection transactions via mobile money services like MTN, Telecel, and AT Ghana.

## Request

```http
POST /api/v1/middleware/collection
```

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token acquired through API authentication |
| `Content-Type` | Yes | Must be `application/json` |

### Request Body

```json
{
   "transactionId": "txn-100", 
   "country": "GH",
   "transactionType": "momo",
   "customerAccount": "233501234567",
   "currency": "GHS",
   "amount": 50.00,
   "itemDescription": "MOMO Payment"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | A unique identifier for the transaction |
| `country` | string | Yes | The country code where the money will be collected from (e.g., "GH" for Ghana) |
| `transactionType` | string | Yes | Must be "momo" for mobile money transactions |
| `customerAccount` | string | Yes | The mobile number of the customer (must include country code) |
| `currency` | string | Yes | The transaction currency (e.g., "GHS" for Ghanaian Cedi) |
| `amount` | number | Yes | The transaction amount |
| `itemDescription` | string | Yes | Description of the transaction. This will appear on the user's mobile phone |

## Response

### Successful Response

```json
{
  "status": "success",
  "message": "Collection request initiated successfully",
  "data": {
    "transactionId": "txn-100",
    "providerReference": "mtn-ref-123456"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": "INVALID_ACCOUNT",
  "message": "Invalid customer account provided"
}
```

## Callback Notifications

PayAngel will send a notification to your configured callback URLs when the collection is complete. The callback URLs must be configured in the business.payangel.com portal under the Channels/TradeName section.

### Successful Collection Callback

When a collection is processed successfully, a callback is sent to the success URL configured in your account:

```json
{
   "code": "SUCCESS",     
   "message": "Collection successful",      
   "data": {                   
     "transactionId": "txn-100",
     "walletid": "wallet-id-123",
     "currency": "GHS",
     "payment_method": "momo",
     "amount": 50.00,
     "fees": 1.25,
     "taxes": 0.25,
     "transactionDate": "2023-09-15T14:23:45Z",
     "country": "GH"
   }
}
```

### Failed Collection Callback

When a collection fails, a callback is sent to the failure URL configured in your account:

```json
{
  "code": "FAILED",
  "message": "Collection failed",
  "failureReason": "User rejected the payment request",
  "transactionId": "txn-100",
  "transactionDate": "2023-09-15T14:25:12Z"
}
```

## Notes

- Mobile money collections are only available in supported countries.
- Ensure that the customer's mobile money account is active and has sufficient funds.
- The `customerAccount` must include the country code (e.g., "233" for Ghana).
- Transaction descriptions should be clear and concise to help customers identify the payment.