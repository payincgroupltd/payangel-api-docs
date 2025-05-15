---
id: payout
title: Payout Transaction
sidebar_label: Payout
---

# Payout Transaction

After successfully verifying the beneficiary's identity, this endpoint allows the agent to complete the payment to the beneficiary and finalize the transaction.

## Endpoint

```
POST /payoutTransaction
```

## Request

```json
{
  "PayBeneficiary": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
      }
    },
    "RequestBody": {
      "agent_id": "AG1001",
      "trans_ref": "PC10007428",
      "terminal_id": "TREMI001",
      "branch_code": "BR0099",
      "branch_name": "ACCRA",
      "external_id": "EA10001"
    }
  }
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | Yes | The unique identifier for the agent |
| `trans_ref` | String | Yes | Transaction reference |
| `terminal_id` | String | Yes | ID of the terminal or device used for payout |
| `branch_code` | String | Yes | Code of the branch where payout is occurring |
| `branch_name` | String | Yes | Name of the branch where payout is occurring |
| `external_id` | String | No | Optional external reference ID for your internal systems |

## Response

A successful response will confirm that the payout was completed:

```json
{
  "PayBeneficiary": {
    "ResponseHeader": {
      "ResponseCode": "000",
      "ResponseMessage": "Success"
    },
    "ResponseBody": {
      "trans_ref": "PC10007428",
      "payout_status": "COMPLETED",
      "payout_time": "2025-05-09T11:45:23",
      "receipt_number": "RCP9087654321"
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `trans_ref` | String | Reference for the transaction |
| `payout_status` | String | Status of the payout (COMPLETED, FAILED) |
| `payout_time` | String | Date and time when the payout was completed (UTC) |
| `receipt_number` | String | Unique receipt number for the transaction |

## Error Codes

| Response Code | Message | Description |
|---------------|---------|-------------|
| 101 | Transaction not found | The provided transaction reference could not be found |
| 102 | Identity verification required | Identity verification has not been completed |
| 103 | Transaction already paid out | The transaction has already been paid out |
| 104 | Transaction aborted | The transaction has been aborted and cannot be paid out |
| 105 | Invalid branch details | The provided branch details are invalid |

## Completion

After a successful payout, the transaction is complete. The beneficiary should receive their funds, and a receipt should be provided to them.

## Special Cases

If there are issues during the payout process, you may need to [Abort the Transaction](/docs/api/cash-pickup/abort) instead of completing it.