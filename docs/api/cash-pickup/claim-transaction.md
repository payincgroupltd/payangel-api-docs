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
      "ResultCode": "00000001",
      "ResultDescription": "Transaction has been locked for processing by Teller #AG1001"
    },
    "ResponseBody": {
      "senderInfo": {
        "first_name": "Myy",
        "middle_name": "",
        "last_name": "Angely",
        "email": "jamegbor12@gmail.com",
        "mobile_number": "+447412202321",
        "address": "Test_AE5 Northfleet",
        "remitter_address2": "Northfleet",
        "country": "gb",
        "state": "Kent",
        "city": "Dartford"
      },
      "receiverInfo": {
        "fname": "Adwoa",
        "mname": "Esi",
        "lname": "Annan",
        "mobile": "+233264476387",
        "city": "Accra",
        "country": "gh",
        "relationship": "Myself"
      },
      "transactionInfo": {
        "source_country": "gb",
        "destination_country": "gh",
        "created_date": "2025-05-09 09:44:56",
        "reason_remittance": "Charity",
        "source_amount": "5",
        "source_currency": "GBP",
        "destination_amount": "25.4305",
        "destination_currency": "GHS"
      },
      "claimExpiry": {
        "expiryIn": 600,
        "unit": "seconds"
      }
    }
  }
}
```

### Response Fields

#### senderInfo
| Field | Type | Description |
|-------|------|-------------|
| `first_name` | String | Sender's first name |
| `middle_name` | String | Sender's middle name (may be empty) |
| `last_name` | String | Sender's last name |
| `email` | String | Sender's email address |
| `mobile_number` | String | Sender's mobile number |
| `address` | String | Sender's primary address |
| `remitter_address2` | String | Sender's secondary address |
| `country` | String | Sender's country code |
| `state` | String | Sender's state/region |
| `city` | String | Sender's city |

#### receiverInfo
| Field | Type | Description |
|-------|------|-------------|
| `fname` | String | Receiver's first name |
| `mname` | String | Receiver's middle name |
| `lname` | String | Receiver's last name |
| `mobile` | String | Receiver's mobile number |
| `city` | String | Receiver's city |
| `country` | String | Receiver's country code |
| `relationship` | String | Relationship to sender |

#### transactionInfo
| Field | Type | Description |
|-------|------|-------------|
| `source_country` | String | Origin country code |
| `destination_country` | String | Destination country code |
| `created_date` | String | Transaction creation date and time |
| `reason_remittance` | String | Purpose of the remittance |
| `source_amount` | String | Amount in source currency |
| `source_currency` | String | Source currency code |
| `destination_amount` | String | Amount in destination currency |
| `destination_currency` | String | Destination currency code |

#### claimExpiry
| Field | Type | Description |
|-------|------|-------------|
| `expiryIn` | Integer | Time until claim expires |
| `unit` | String | Time unit (seconds) |

## Error Codes

| Response Code | Message | Description |
|---------------|---------|-------------|
| 001 | Transaction not found | The provided PCCN or transaction reference could not be found |
| 002 | Transaction already processed | The transaction has already been claimed and processed |
| 003 | Transaction expired | The transaction has expired and cannot be claimed |
| 004 | Invalid agent | The agent is not authorized to process this transaction |

## Next Steps

After successfully claiming a transaction, the agent should proceed to verify the beneficiary's identity using the [Verify Beneficiary Identity](/docs/api/cash-pickup/verify-identity) endpoint.