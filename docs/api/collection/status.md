---
id: status
title: Collection Status
sidebar_label: Status
---

# Collection Status

This endpoint allows you to check the status of a previously initiated collection transaction.

## Request

```http
GET /api/v1/middleware/collection/status/{transactionId}
```

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token acquired through API authentication |

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | The unique transaction ID of the collection to check |

## Response

### Successful Response

```json
{
  "status": "success",
  "data": {
    "transactionId": "txn-100",
    "status": "COMPLETED",
    "transactionType": "momo",
    "amount": 50.00,
    "currency": "GHS",
    "customerAccount": "233501234567",
    "providerReference": "mtn-ref-123456",
    "createdAt": "2023-09-15T14:20:12Z",
    "completedAt": "2023-09-15T14:23:45Z"
  }
}
```

### Pending Transaction Response

```json
{
  "status": "success",
  "data": {
    "transactionId": "txn-100",
    "status": "PENDING",
    "transactionType": "momo",
    "amount": 50.00,
    "currency": "GHS", 
    "customerAccount": "233501234567",
    "providerReference": "mtn-ref-123456",
    "createdAt": "2023-09-15T14:20:12Z"
  }
}
```

### Failed Transaction Response

```json
{
  "status": "success",
  "data": {
    "transactionId": "txn-100",
    "status": "FAILED",
    "failureReason": "User rejected the payment request",
    "transactionType": "momo",
    "amount": 50.00,
    "currency": "GHS",
    "customerAccount": "233501234567",
    "providerReference": "mtn-ref-123456",
    "createdAt": "2023-09-15T14:20:12Z",
    "failedAt": "2023-09-15T14:25:12Z"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": "TRANSACTION_NOT_FOUND",
  "message": "The specified transaction ID does not exist"
}
```

## Collection Transaction Statuses

| Status | Description |
|--------|-------------|
| `PENDING` | The collection request has been initiated but is not yet complete |
| `PROCESSING` | The collection request is being processed by the payment provider |
| `COMPLETED` | The collection was successful and funds have been deposited |
| `FAILED` | The collection attempt failed |
| `EXPIRED` | The collection request has expired without being completed |

## Notes

- It's recommended to use the callback notifications for real-time updates rather than polling this endpoint.
- This endpoint can be useful for reconciliation or for checking the status of collections with uncertain outcomes.
- Transaction records are typically available for a period of 90 days, after which they may be archived.