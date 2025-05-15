---
id: overview
title: Cash Pickup API Overview
sidebar_label: Overview
---

# Cash Pickup API

The PayAngel Cash Pickup API allows agents to process cash pickup transactions. This API enables financial institutions and their agents to claim, verify, and pay out remittances to beneficiaries in person.

## How It Works

The Cash Pickup API follows a specific workflow:

1. **Agent Authentication** - Agents must authenticate to receive a token for subsequent API calls
2. **Claim Transaction** - Agent claims a transaction using the PCCN code or transaction reference  
3. **Verify Beneficiary Identity** - Agent verifies the beneficiary's identity using their ID
4. **Payout Beneficiary** - Agent completes the payout to the beneficiary
5. **Abort Transaction** (if needed) - Agent can abort a transaction if verification fails

## Base URL

```
https://dev.payangel.com/business_apiV1.0/Cashpickup
```

## Authentication

All API requests (except authentication) require a valid token in the `SessionIdentity` section of the request header.

To obtain a token, use the login endpoint:

```bash
POST /login
```

The token is valid for 60 minutes.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | Authenticate agent and obtain token |
| `/pullTransaction` | POST | Claim a transaction using PCCN or reference |
| `/confirmBeneficiaryIdentity` | POST | Verify beneficiary's identity document |
| `/payoutTransaction` | POST | Complete the payout to beneficiary |
| `/abortTransaction` | POST | Abort a transaction (if verification fails) |

## Common Request Structure

All API requests follow a standard structure with a `RequestHeader` and `RequestBody` section:

```json
{
  "EndpointName": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "your-authentication-token"
      }
    },
    "RequestBody": {
      // Endpoint-specific parameters
    }
  }
}
```

Each endpoint has specific parameters required in the RequestBody section, which are detailed in their respective documentation pages.