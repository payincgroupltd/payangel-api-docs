---
id: status
title: Transaction Status
sidebar_label: Transaction Status
slug: /api/disbursement/status
---

# Transaction Status

This endpoint allows you to check the status of a single transaction.

## Endpoint

```
GET https://api.payangel.com/v1/disbursements/{transaction_id}
```

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `transaction_id` | string | Yes | The unique identifier of the transaction |

## Response

The response format for checking transaction status is as follows:

```json
{
  "code": "0016-001",
  "message": "The transaction is pending",
  "details": {
    "status": "PENDING",
    "transactionId": "PA-76492c33-0f51-4065-8ec5-4f90e24e-1",
    "reference_id": "STA-100000603392",
    "providerResponse": {
      "uniqueId": "PA53aa509b_146366e3081d47",
      "creditAccount": "12345655",
      "amounts": "10.00",
      "status": "Pending",
      "message": "Transaction is being processed",
      "createdDate": "4/2/2025 9:53:16 AM"
    },
    "provider": "MDW-CBG",
    "providerTransactionreference": "PA53aa509b_146366e3081d47"
  }
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| `code` | Transaction code indicating whether the transaction was successful or not |
| `message` | Description of the transaction code |
| `details.status` | Transaction status (SUCCESS, FAILURE, PENDING, or RETRY) |
| `details.transactionId` | The transaction ID |
| `details.reference_id` | Additional unique reference for the transaction |
| `details.providerResponse` | Optional key-value pair. Only available to PayAngel |
| `details.provider` | The 3rd party provider used to fulfill the request. Only available to PayAngel |
| `details.providerTransactionreference` | The provider's reference ID |

## Transaction Status Codes

| Code | Message |
|------|---------|
| 0016-000 | The operation was successful |
| 0016-001 | The transaction is pending |
| E0016-001 | The operation was unsuccessful |
| E0016-002 | The reference Id provided may not be valid |
| E0016-003 | The transaction was not found |
| E0016-004 | Unable to fulfill the request now. Try again later |
| E0016-005 | The transaction was found but not processed yet |
| E0016-006 | The service is currently unavailable |  
| E0016-007 | Insufficient funds |
| V0016-005 | The transaction Id is empty or not valid. Only numbers, letters, underscores, and hyphens are allowed |

## Example Requests

### JavaScript

```javascript
const axios = require('axios');

async function checkTransactionStatus(transactionId) {
  try {
    const response = await axios.get(`https://api.payangel.com/v1/disbursements/${transactionId}`, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

checkTransactionStatus('PA-76492c33-0f51-4065-8ec5-4f90e24e-1');
```

### TypeScript

```typescript
import axios from 'axios';

interface ProviderResponse {
  uniqueId: string;
  creditAccount: string;
  amounts: string;
  status: string;
  message: string;
  createdDate: string;
}

interface TransactionDetails {
  status: 'SUCCESS' | 'FAILURE' | 'PENDING' | 'RETRY';
  transactionId: string;
  reference_id: string;
  providerResponse?: ProviderResponse;
  provider?: string;
  providerTransactionreference?: string;
}

interface TransactionStatusResponse {
  code: string;
  message: string;
  details: TransactionDetails;
}

async function checkTransactionStatus(transactionId: string): Promise<TransactionStatusResponse> {
  try {
    const response = await axios.get<TransactionStatusResponse>(
      `https://api.payangel.com/v1/disbursements/${transactionId}`,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.response.data);
      throw error.response.data;
    }
    throw error;
  }
}

checkTransactionStatus('PA-76492c33-0f51-4065-8ec5-4f90e24e-1')
  .then(data => {
    console.log(`Transaction status: ${data.details.status}`);
    console.log(`Message: ${data.message}`);
  })
  .catch(error => console.error('Failed to check status:', error));
```

### Go

```go
package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type ProviderResponse struct {
	UniqueID      string `json:"uniqueId"`
	CreditAccount string `json:"creditAccount"`
	Amounts       string `json:"amounts"`
	Status        string `json:"status"`
	Message       string `json:"message"`
	CreatedDate   string `json:"createdDate"`
}

type TransactionDetails struct {
	Status                      string           `json:"status"`
	TransactionID               string           `json:"transactionId"`
	ReferenceID                 string           `json:"reference_id"`
	ProviderResponse            *ProviderResponse `json:"providerResponse,omitempty"`
	Provider                    string           `json:"provider,omitempty"`
	ProviderTransactionreference string           `json:"providerTransactionreference,omitempty"`
}

type TransactionStatusResponse struct {
	Code    string             `json:"code"`
	Message string             `json:"message"`
	Details TransactionDetails `json:"details"`
}

func checkTransactionStatus(transactionID, apiKey string) (*TransactionStatusResponse, error) {
	url := fmt.Sprintf("https://api.payangel.com/v1/disbursements/%s", transactionID)
	
	// Create a new request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	
	// Add authorization header
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", apiKey))
	req.Header.Add("Content-Type", "application/json")
	
	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %w", err)
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response: %w", err)
	}
	
	// Parse response
	var response TransactionStatusResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}
	
	return &response, nil
}

func main() {
	apiKey := "your_api_key_here"
	transactionID := "PA-76492c33-0f51-4065-8ec5-4f90e24e-1"
	
	response, err := checkTransactionStatus(transactionID, apiKey)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	
	fmt.Printf("Code: %s\n", response.Code)
	fmt.Printf("Message: %s\n", response.Message)
	fmt.Printf("Status: %s\n", response.Details.Status)
	fmt.Printf("Transaction ID: %s\n", response.Details.TransactionID)
	fmt.Printf("Reference ID: %s\n", response.Details.ReferenceID)
}
```