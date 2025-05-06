---
id: single-transaction
title: Single Disbursement Transaction
sidebar_label: Single Transaction
slug: /api/disbursement/single-transaction
---

# Single Disbursement Transaction

This endpoint allows you to create a single disbursement transaction to transfer funds to a recipient.

## Endpoint

```
POST https://api.payangel.com/v1/disbursements/single
```

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `reference` | string | Yes | Your unique reference for this transaction |
| `amount` | number | Yes | Amount to be transferred |
| `currency` | string | Yes | Currency code (e.g., GHS, NGN, USD) |
| `source_account` | string | Yes | Your PayAngel account to debit |
| `destination_type` | string | Yes | Type of destination (`bank_account`, `mobile_money`, `cash_pickup`) |
| `recipient` | object | Yes | Recipient information |
| `narration` | string | Yes | Purpose of the transfer |
| `callback_url` | string | No | URL to receive status updates via webhook |

### Recipient Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Recipient's full name |
| `email` | string | No | Recipient's email address |
| `phone` | string | Yes | Recipient's phone number |
| `address` | string | No | Recipient's physical address |
| `bank_code` | string | Conditional | Required for bank transfers |
| `account_number` | string | Conditional | Required for bank transfers |
| `mobile_network` | string | Conditional | Required for mobile money transfers |
| `mobile_number` | string | Conditional | Required for mobile money transfers |

## Response

### Success Response

```json
{
  "status": "success",
  "message": "Transaction created successfully",
  "data": {
    "transaction_id": "txn_123456789",
    "reference": "your-reference",
    "amount": 1000,
    "fee": 10,
    "total": 1010,
    "currency": "GHS",
    "status": "PENDING",
    "created_at": "2023-06-15T14:30:00Z",
    "estimated_delivery": "2023-06-15T15:30:00Z"
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Invalid destination account",
  "errors": [
    {
      "field": "recipient.account_number",
      "message": "Account number is invalid"
    }
  ]
}
```

## Example Requests

### Bank Transfer

#### JavaScript

```javascript
const axios = require('axios');

async function createDisbursement() {
  try {
    const response = await axios.post('https://api.payangel.com/v1/disbursements/single', {
      reference: 'INV-001-PAYMENT',
      amount: 1000,
      currency: 'GHS',
      source_account: 'acc_123456789',
      destination_type: 'bank_account',
      recipient: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+233501234567',
        bank_code: 'GH123456',
        account_number: '1234567890'
      },
      narration: 'Invoice payment',
      callback_url: 'https://your-website.com/webhooks/payangel'
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

createDisbursement();
```

#### TypeScript

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

interface DisbursementRequest {
  reference: string;
  amount: number;
  currency: string;
  source_account: string;
  destination_type: 'bank_account' | 'mobile_money' | 'cash_pickup';
  recipient: Recipient;
  narration: string;
  callback_url?: string;
}

async function createDisbursement() {
  try {
    const requestData: DisbursementRequest = {
      reference: 'INV-001-PAYMENT',
      amount: 1000,
      currency: 'GHS',
      source_account: 'acc_123456789',
      destination_type: 'bank_account',
      recipient: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+233501234567',
        bank_code: 'GH123456',
        account_number: '1234567890'
      },
      narration: 'Invoice payment',
      callback_url: 'https://your-website.com/webhooks/payangel'
    };
    
    const response = await axios.post(
      'https://api.payangel.com/v1/disbursements/single',
      requestData,
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createDisbursement();
```

#### Go

```go
package main

import (
	"bytes"
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
}

type DisbursementRequest struct {
	Reference       string    `json:"reference"`
	Amount          float64   `json:"amount"`
	Currency        string    `json:"currency"`
	SourceAccount   string    `json:"source_account"`
	DestinationType string    `json:"destination_type"`
	Recipient       Recipient `json:"recipient"`
	Narration       string    `json:"narration"`
	CallbackURL     string    `json:"callback_url,omitempty"`
}

func main() {
	// Create request payload
	requestData := DisbursementRequest{
		Reference:       "INV-001-PAYMENT",
		Amount:          1000,
		Currency:        "GHS",
		SourceAccount:   "acc_123456789",
		DestinationType: "bank_account",
		Recipient: Recipient{
			Name:          "John Doe",
			Email:         "john.doe@example.com",
			Phone:         "+233501234567",
			BankCode:      "GH123456",
			AccountNumber: "1234567890",
		},
		Narration:   "Invoice payment",
		CallbackURL: "https://your-website.com/webhooks/payangel",
	}

	// Convert to JSON
	jsonData, err := json.Marshal(requestData)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	// Create request
	url := "https://api.payangel.com/v1/disbursements/single"
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}

	// Add headers
	req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Add("Content-Type", "application/json")

	// Send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	// Read response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}

	fmt.Println(string(body))
}
```

#### Java

```java
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class PayAngelDisbursement {
    public static void main(String[] args) {
        try {
            // Create connection
            URL url = new URL("https://api.payangel.com/v1/disbursements/single");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer YOUR_API_KEY");
            conn.setDoOutput(true);

            // Create JSON payload
            String jsonPayload = "{"
                + "\"reference\": \"INV-001-PAYMENT\","
                + "\"amount\": 1000,"
                + "\"currency\": \"GHS\","
                + "\"source_account\": \"acc_123456789\","
                + "\"destination_type\": \"bank_account\","
                + "\"recipient\": {"
                + "  \"name\": \"John Doe\","
                + "  \"email\": \"john.doe@example.com\","
                + "  \"phone\": \"+233501234567\","
                + "  \"bank_code\": \"GH123456\","
                + "  \"account_number\": \"1234567890\""
                + "},"
                + "\"narration\": \"Invoice payment\","
                + "\"callback_url\": \"https://your-website.com/webhooks/payangel\""
                + "}";

            // Write payload to connection
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Read response
            int responseCode = conn.getResponseCode();
            StringBuilder response = new StringBuilder();
            try (Scanner scanner = new Scanner(conn.getInputStream(), StandardCharsets.UTF_8.name())) {
                while (scanner.hasNextLine()) {
                    response.append(scanner.nextLine());
                }
            }

            System.out.println("Response Code: " + responseCode);
            System.out.println("Response: " + response.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Mobile Money Transfer

#### JavaScript

```javascript
const axios = require('axios');

async function createMobileMoneyDisbursement() {
  try {
    const response = await axios.post('https://api.payangel.com/v1/disbursements/single', {
      reference: 'MOMO-PAYMENT-001',
      amount: 500,
      currency: 'GHS',
      source_account: 'acc_123456789',
      destination_type: 'mobile_money',
      recipient: {
        name: 'Jane Smith',
        phone: '+233507654321',
        mobile_network: 'MTN',
        mobile_number: '0507654321'
      },
      narration: 'Mobile money transfer',
      callback_url: 'https://your-website.com/webhooks/payangel'
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

createMobileMoneyDisbursement();
```

## Idempotency

To prevent duplicate transactions, you should use your own unique reference for each transaction. If you submit multiple requests with the same reference, only the first one will be processed, and subsequent requests will return the result of the original request.