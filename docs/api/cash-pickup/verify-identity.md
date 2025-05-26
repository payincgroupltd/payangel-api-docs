---
id: verify-identity
title: Verify Beneficiary Identity
sidebar_label: Verify Identity
---

# Verify Beneficiary Identity

After claiming a transaction, this endpoint allows the agent to verify the beneficiary's identity by submitting their identification document details.

## Endpoint

```
POST /confirmBeneficiaryIdentity
```

## Request

```json
{
  "ConfirmBenefIdentity": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
      }
    },
    "RequestBody": {
      "agent_id": "AG1001",
      "trans_ref": "PC10007428",
      "id_type": "DRIVING_LICENSE",
      "id_number": "123456788",
      "expiry_date": "2026-09-09",
      "city": "Kent",
      "country": "United Kingdom",
      "status": 1,
      "failure_reason": "OTHER",
      "other_reason": "Optional explanation for failure"
    }
  }
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | Yes | The unique identifier for the agent |
| `trans_ref` | String | Yes | Transaction reference |
| `id_type` | String | Yes | Type of ID document presented (NATIONAL_ID, PASSPORT, DRIVING_LICENSE) |
| `id_number` | String | Yes | Identification document number |
| `expiry_date` | String | Yes | Expiration date of the ID document (YYYY-MM-DD) |
| `city` | String | Yes | City on the ID document or where verification is taking place |
| `country` | String | Yes | Country on the ID document or where verification is taking place |
| `status` | Integer | Yes | Verification status (1=Success, 0=Failed) |
| `failure_reason` | String | Conditional | Required if status=0. Options: ID_EXPIRED, ID_INVALID, PHOTO_MISMATCH, OTHER |
| `other_reason` | String | Conditional | Required if failure_reason=OTHER. Free text explanation |

## Response

A successful response will confirm that the identity verification was processed:

```json
{
  "ConfirmBenefIdentity": {
    "ResponseHeader": {
      "ResultCode": "00000001",
      "ResultDescription": "Identity details submitted successfully"
    },
    "ResponseBody": "Identity details submitted successfully"
  }
}
```

### Response Fields

The response body contains a simple success message confirming that the identity details have been submitted successfully.

## ID Types

The following ID types are supported for beneficiary verification:

| ID Type | Description |
|---------|-------------|
| `NATIONAL_ID` | National identification card |
| `PASSPORT` | International passport |
| `DRIVING_LICENSE` | Driver's license |

## Failure Reasons

When identity verification fails (status=0), you must provide one of the following failure reasons:

| Reason | Description |
|--------|-------------|
| `ID_EXPIRED` | The ID document has expired |
| `ID_INVALID` | The ID document appears invalid or tampered with |
| `PHOTO_MISMATCH` | The photo on the ID doesn't match the beneficiary |
| `OTHER` | Other reason (specify in other_reason field) |

## Next Steps

- If verification is successful, proceed to the [Payout Transaction](/docs/api/cash-pickup/payout) endpoint
- If verification fails, use the [Abort Transaction](/docs/api/cash-pickup/abort) endpoint