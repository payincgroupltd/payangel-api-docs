---
id: authentication
title: Agent Authentication
sidebar_label: Authentication
---

# Agent Authentication

Before accessing any Cash Pickup API endpoints, agents must authenticate to obtain a token that will be used in subsequent API calls.

## Endpoint

```
POST /login
```

## Request

```json
{
  "UserAuthentication": {
    "RequestBody": {
      "agent_id": "AG1001",
      "agent_secret": "123456"
    }
  }
}
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | String | Yes | The unique identifier for the agent |
| `agent_secret` | String | Yes | The agent's secret key |

## Response

A successful response will include a token that must be used in all subsequent API calls:

```json
{
  "UserAuthentication": {
    "ResponseHeader": {
      "ResultCode": "00000001",
      "ResultDescription": "Login succeeded"
    },
    "ResponseBody": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyiQUcxMDAxIn0.FWcA5KvRLDWdWkx6opffUn3Pk4ihfpm1O_zDMrkWPMA",
      "expiresIn": 3600
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `token` | String | JWT token to be used in all subsequent API calls |
| `expiresIn` | Integer | The expiration time of the token in seconds (3600 = 1 hour) |

## Using the Token

The token must be included in the `SessionIdentity` section of the request header in all subsequent API calls:

```json
{
  "EndpointName": {
    "RequestHeader": {
      "SessionIdentity": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
      }
    },
    "RequestBody": {
      // Endpoint-specific parameters
    }
  }
}
```

## Token Lifespan

The authentication token is valid for 60 minutes from the time it is issued. After expiry, a new token must be obtained by calling the authentication endpoint again.

