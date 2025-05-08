---
id: card
title: Card Collection
sidebar_label: Card
---

# Card Collection

This endpoint allows you to initiate collection transactions via debit and credit cards.

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
   "transactionId": "card-txn-100", 
   "country": "GH",
   "transactionType": "card",
   "customerAccount": "customer@example.com",
   "currency": "GHS",
   "amount": 100.00,
   "itemDescription": "Product purchase",
   "redirectUrl": "https://yourbusiness.com/payment/complete"
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | A unique identifier for the transaction |
| `country` | string | Yes | The country code where the money will be collected from |
| `transactionType` | string | Yes | Must be "card" for card transactions |
| `customerAccount` | string | Yes | The customer's email address or identifier |
| `currency` | string | Yes | The transaction currency (e.g., "GHS" for Ghanaian Cedi) |
| `amount` | number | Yes | The transaction amount |
| `itemDescription` | string | Yes | Description of the transaction |
| `redirectUrl` | string | No | URL to redirect the customer after payment completion |

## Response

### Successful Response

```json
{
  "status": "success",
  "message": "Card collection request initiated successfully",
  "data": {
    "transactionId": "card-txn-100",
    "paymentUrl": "https://pay.payangel.com/checkout/card-txn-100",
    "expiresAt": "2023-09-15T16:23:45Z"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": "INVALID_CURRENCY",
  "message": "The provided currency is not supported for card transactions"
}
```

## Callback Notifications

PayAngel will send a notification to your configured callback URLs when the card collection is complete. The callback URLs must be configured in the business.payangel.com portal under the Channels/TradeName section.

### Successful Collection Callback

When a collection is processed successfully, a callback is sent to the success URL configured in your account:

```json
{
   "code": "SUCCESS",     
   "message": "Collection successful",      
   "data": {                   
     "transactionId": "card-txn-100",
     "walletid": "wallet-id-123",
     "currency": "GHS",
     "payment_method": "card",
     "amount": 100.00,
     "fees": 2.50,
     "taxes": 0.50,
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
  "failureReason": "Card declined by issuer",
  "transactionId": "card-txn-100",
  "transactionDate": "2023-09-15T14:25:12Z"
}
```

## Card Collection Flow

1. Your system initiates a card collection request
2. PayAngel returns a payment URL
3. You redirect the customer to this URL or embed it in your interface
4. The customer completes the payment with their card details
5. PayAngel processes the payment and sends a callback notification
6. The customer is redirected to your `redirectUrl` (if provided)

## Notes

- Card collections support major credit and debit cards including Visa, Mastercard, and local cards.
- Payment pages are PCI-DSS compliant and securely hosted by PayAngel.
- The payment URL is valid for a limited time as indicated in the `expiresAt` field.
- Ensure your success and failure callback URLs are properly configured in the business portal.