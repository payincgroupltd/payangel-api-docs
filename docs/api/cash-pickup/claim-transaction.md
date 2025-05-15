---
id: claim-transaction
title: Claim Transaction
sidebar_label: Claim Transaction
---

# Claim Transaction

This endpoint allows an agent to claim a cash pickup transaction using either the PCCN (Personal Collection Code Number) provided to the beneficiary or the transaction reference.

## Endpoint

```
POST /pullTransaction
```

## Request

```json
{
  "PullTransaction": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
      }
    },
    "RequestBody": {
      "agent_id": "AG1001",
      "pccn": "CDZ9N40P",
      "trans_ref": "PC10007429"
    }
  }
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | Yes | The unique identifier for the agent |
| `pccn` | String | Conditional | Personal Collection Code Number provided to the beneficiary (required if `trans_ref` is not provided) |
| `trans_ref` | String | Conditional | Transaction reference (required if `pccn` is not provided) |

## Response

A successful response will include details about the transaction and beneficiary:

```json
{
  "PullTransaction": {
    "ResponseHeader": {
      "ResponseCode": "000",
      "ResponseMessage": "Success"
    },
    "ResponseBody": {
      "trans_details": {
        "trans_ref": "PC10007429",
        "pccn": "CDZ9N40P",
        "sender_name": "John Doe",
        "sender_country": "United Kingdom",
        "beneficiary_name": "Jane Smith",
        "amount": "500.00",
        "currency": "GHS",
        "status": "READY",
        "expected_id_type": "NATIONAL_ID,PASSPORT,DRIVING_LICENSE",
        "created_date": "2025-05-01T10:15:23",
        "expiry_date": "2025-06-01T10:15:23"
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trans_ref` | String | Unique reference for the transaction |
| `pccn` | String | Personal Collection Code Number |
| `sender_name` | String | Name of the person who sent the money |
| `sender_country` | String | Country of the sender |
| `beneficiary_name` | String | Name of the beneficiary who will receive the money |
| `amount` | String | Amount to be paid out |
| `currency` | String | Currency code of the payout amount |
| `status` | String | Current status of the transaction |
| `expected_id_type` | String | Comma-separated list of accepted ID types for verification |
| `created_date` | String | Date and time when the transaction was created (UTC) |
| `expiry_date` | String | Date and time when the transaction expires (UTC) |

## Error Codes

| Response Code | Message | Description |
|---------------|---------|-------------|
| 001 | Transaction not found | The provided PCCN or transaction reference could not be found |
| 002 | Transaction already processed | The transaction has already been claimed and processed |
| 003 | Transaction expired | The transaction has expired and cannot be claimed |
| 004 | Invalid agent | The agent is not authorized to process this transaction |

## Next Steps

After successfully claiming a transaction, the agent should proceed to verify the beneficiary's identity using the [Verify Beneficiary Identity](/docs/api/cash-pickup/verify-identity) endpoint.