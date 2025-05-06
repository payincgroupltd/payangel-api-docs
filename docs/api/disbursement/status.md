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

### Success Response

```json
{
  "status": "success",
  "message": "Transaction details retrieved successfully",
  "data": {
    "transaction_id": "txn_123456789",
    "reference": "your-reference",
    "amount": 1000,
    "fee": 10,
    "total": 1010,
    "currency": "GHS",
    "status": "COMPLETED",
    "destination_type": "bank_account",
    "recipient": {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+233501234567",
      "bank_code": "GH123456",
      "account_number": "1234567890"
    },
    "narration": "Salary payment",
    "created_at": "2023-06-15T14:30:00Z",
    "updated_at": "2023-06-15T15:30:00Z",
    "completed_at": "2023-06-15T15:30:00Z"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Transaction not found",
  "errors": [
    {
      "field": "transaction_id",
      "message": "Transaction with ID txn_123456789 not found"
    }
  ]
}
```

## Transaction Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Transaction has been received and is pending processing |
| `PROCESSING` | Transaction is currently being processed |
| `COMPLETED` | Transaction has been successfully completed |
| `FAILED` | Transaction has failed |
| `CANCELLED` | Transaction has been cancelled |

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

checkTransactionStatus('txn_123456789');
```

### TypeScript

```typescript
import axios from 'axios';

interface Recipient {
  name: string;
  email?: string;
  phone: string;
  bank_code?: string;
  account_number?: string;
  mobile_network?: string;
  mobile_number?: string;
}

interface TransactionResponse {
  transaction_id: string;
  reference: string;
  amount: number;
  fee: number;
  total: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  destination_type: string;
  recipient: Recipient;
  narration: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: TransactionResponse;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

async function checkTransactionStatus(transactionId: string): Promise<ApiResponse> {
  try {
    const response = await axios.get<ApiResponse>(
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

checkTransactionStatus('txn_123456789')
  .then(data => {
    if (data.status === 'success' && data.data) {
      console.log(`Transaction status: ${data.data.status}`);
    }
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

type Recipient struct {
	Name          string `json:"name"`
	Email         string `json:"email,omitempty"`
	Phone         string `json:"phone"`
	BankCode      string `json:"bank_code,omitempty"`
	AccountNumber string `json:"account_number,omitempty"`
	MobileNetwork string `json:"mobile_network,omitempty"`
	MobileNumber  string `json:"mobile_number,omitempty"`
}

type TransactionResponse struct {
	TransactionID   string    `json:"transaction_id"`
	Reference       string    `json:"reference"`
	Amount          float64   `json:"amount"`
	Fee             float64   `json:"fee"`
	Total           float64   `json:"total"`
	Currency        string    `json:"currency"`
	Status          string    `json:"status"`
	DestinationType string    `json:"destination_type"`
	Recipient       Recipient `json:"recipient"`
	Narration       string    `json:"narration"`
	CreatedAt       string    `json:"created_at"`
	UpdatedAt       string    `json:"updated_at"`
	CompletedAt     string    `json:"completed_at,omitempty"`
}

type ApiResponse struct {
	Status  string             `json:"status"`
	Message string             `json:"message"`
	Data    *TransactionResponse `json:"data,omitempty"`
	Errors  []struct {
		Field   string `json:"field"`
		Message string `json:"message"`
	} `json:"errors,omitempty"`
}

func checkTransactionStatus(transactionID, apiKey string) (*ApiResponse, error) {
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
	
	// Handle non-200 responses
	if resp.StatusCode != http.StatusOK {
		var errResp ApiResponse
		if err := json.Unmarshal(body, &errResp); err != nil {
			return nil, fmt.Errorf("error parsing error response: %w", err)
		}
		return &errResp, fmt.Errorf("API error: %s", errResp.Message)
	}
	
	// Parse response
	var response ApiResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("error parsing response: %w", err)
	}
	
	return &response, nil
}

func main() {
	apiKey := "your_api_key_here"
	transactionID := "txn_123456789"
	
	response, err := checkTransactionStatus(transactionID, apiKey)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	
	if response.Status == "success" && response.Data != nil {
		fmt.Printf("Transaction status: %s\n", response.Data.Status)
		fmt.Printf("Amount: %.2f %s\n", response.Data.Amount, response.Data.Currency)
		fmt.Printf("Created at: %s\n", response.Data.CreatedAt)
		if response.Data.CompletedAt != "" {
			fmt.Printf("Completed at: %s\n", response.Data.CompletedAt)
		}
	} else {
		fmt.Printf("Error: %s\n", response.Message)
		for _, err := range response.Errors {
			fmt.Printf("- %s: %s\n", err.Field, err.Message)
		}
	}
}