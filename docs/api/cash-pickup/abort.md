---
id: abort
title: Abort Transaction
sidebar_label: Abort Transaction
---

# Abort Transaction

This endpoint allows an agent to abort a transaction that cannot be completed, typically due to identity verification failure or other issues preventing payout.

## Endpoint

```
POST /abortTransaction
```

## Request

```json
{
  "AbortPayout": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
      }
    },
    "RequestBody": {
      "agent_id": "AG1001",
      "trans_ref": "PC10007424",
      "reason_type": "OTHER",
      "other_reason": "Detailed explanation for aborting the transaction"
    }
  }
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | Yes | The unique identifier for the agent |
| `trans_ref` | String | Yes | Transaction reference |
| `reason_type` | String | Yes | Reason for aborting (INVALID_ID, SUSPICIOUS_ACTIVITY, ID_EXPIRED, OTHER) |
| `other_reason` | String | Conditional | Required if reason_type=OTHER. Free text explanation |

## Response

A successful response will confirm that the transaction was aborted:

```json
{
  "AbortPayout": {
    "ResponseHeader": {
      "ResponseCode": "000",
      "ResponseMessage": "Success"
    },
    "ResponseBody": {
      "trans_ref": "PC10007424",
      "abort_status": "COMPLETED",
      "abort_time": "2025-05-09T12:30:45"
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trans_ref` | String | Reference for the transaction |
| `abort_status` | String | Status of the abort operation (COMPLETED, FAILED) |
| `abort_time` | String | Date and time when the transaction was aborted (UTC) |

## Abort Reason Types

When aborting a transaction, you must provide one of the following reason types:

| Reason Type | Description |
|-------------|-------------|
| `INVALID_ID` | The ID document appears to be invalid or tampered with |
| `SUSPICIOUS_ACTIVITY` | Suspicious behavior or potential fraud detected |
| `ID_EXPIRED` | The ID document has expired |
| `OTHER` | Other reason (specify in other_reason field) |

## Error Codes

| Response Code | Message | Description |
|---------------|---------|-------------|
| 201 | Transaction not found | The provided transaction reference could not be found |
| 202 | Transaction already processed | The transaction has already been paid out and cannot be aborted |
| 203 | Transaction already aborted | The transaction has already been aborted |

## Transaction Flow

When a transaction is aborted:

1. The beneficiary will not receive funds at this branch
2. The sender may be notified, depending on the system configuration
3. The transaction may become available for retry at a different branch, or the sender may need to cancel and reissue the payment