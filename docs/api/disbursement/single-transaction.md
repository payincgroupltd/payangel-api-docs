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

| Field | Type | Required | Description |
|-----------|------|----------|-------------|
| `transactionId` | string | Yes | Unique ID for payout transaction |
| `senderFirstName` | string | Yes | The first name of the sender |
| `senderMiddlename` | string | No | The middle name of the sender |
| `senderLastName` | string | Yes | The last name of the sender |
| `senderPhone` | string | No | Phone number of the sender |
| `countryTo` | string | Yes | The destination ISO country code. e.g. GH |
| `countryFrom` | string | Yes | The origination ISO country code. e.g. US |
| `sendingCurrency` | string | Yes | The currency code of the sender e.g. USD |
| `receivingCurrency` | string | Yes | The currency code of the receiver e.g. GHS |
| `destinationAmount` | Number | Yes | The amount to be sent to receiver |
| `beneficiaryFirstName` | string | Yes | The beneficiary first name |
| `beneficiaryMiddleName` | string | No | The beneficiary middle name |
| `beneficiaryLastName` | string | Yes | The beneficiary last name |
| `transferType` | string | Yes | The type of transaction. Possible values are: Mobile or Bank |
| `bankAccountNumber` | string | No* | The recipient bank account number |
| `bankName` | string | No* | The recipient bank name |
| `bankBranch` | string | No* | The recipient bank branch |
| `bankCode` | string | No* | The recipient bank code. [See Bank Codes](/docs/api/disbursement/bank-codes) for list of PayAngel bank codes |
| `mobileNetwork` | string | No** | The beneficiary mobile money network |
| `mobileNumber` | string | No** | The beneficiary mobile money number |
| `transferReason` | string | Yes | The reason for the payout |
| `callbackurl` | string | No | The callback URL to receive response customer |
| `ref` | string | Yes | The sender/customer reference number |
| `purposeDetails` | string | No | Additional details about the transaction |

\* *When the transferType is Bank, the bankAccountNumber, bankName, bankBranch and bankCode are required.*  
\** *When the transferType is Mobile, the mobileNetwork and mobileNumber are required.*  
*The optional fields can be left blank or not included in the request.*

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
      "field": "bankAccountNumber",
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
      transactionId: "PAY-123456789",
      senderFirstName: "John",
      senderLastName: "Doe",
      senderPhone: "+16175551234",
      countryTo: "GH",
      countryFrom: "US",
      sendingCurrency: "USD",
      receivingCurrency: "GHS",
      destinationAmount: 1000,
      beneficiaryFirstName: "Jane",
      beneficiaryLastName: "Smith",
      transferType: "Bank",
      bankAccountNumber: "1234567890",
      bankName: "STANDARD CHARTERED BANK",
      bankBranch: "HIGH STREET",
      bankCode: "300302",
      transferReason: "Family Support",
      ref: "INV-001-PAYMENT",
      purposeDetails: "Monthly allowance"
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

interface DisbursementRequest {
  transactionId: string;
  senderFirstName: string;
  senderMiddlename?: string;
  senderLastName: string;
  senderPhone?: string;
  countryTo: string;
  countryFrom: string;
  sendingCurrency: string;
  receivingCurrency: string;
  destinationAmount: number;
  beneficiaryFirstName: string;
  beneficiaryMiddleName?: string;
  beneficiaryLastName: string;
  transferType: 'Bank' | 'Mobile';
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankCode?: string;
  mobileNetwork?: string;
  mobileNumber?: string;
  transferReason: string;
  callbackurl?: string;
  ref: string;
  purposeDetails?: string;
}

async function createDisbursement() {
  try {
    const requestData: DisbursementRequest = {
      transactionId: "PAY-123456789",
      senderFirstName: "John",
      senderLastName: "Doe",
      senderPhone: "+16175551234",
      countryTo: "GH",
      countryFrom: "US",
      sendingCurrency: "USD",
      receivingCurrency: "GHS",
      destinationAmount: 1000,
      beneficiaryFirstName: "Jane",
      beneficiaryLastName: "Smith",
      transferType: "Bank",
      bankAccountNumber: "1234567890",
      bankName: "STANDARD CHARTERED BANK",
      bankBranch: "HIGH STREET",
      bankCode: "300302",
      transferReason: "Family Support",
      ref: "INV-001-PAYMENT",
      purposeDetails: "Monthly allowance"
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

type DisbursementRequest struct {
	TransactionId        string  `json:"transactionId"`
	SenderFirstName      string  `json:"senderFirstName"`
	SenderMiddlename     string  `json:"senderMiddlename,omitempty"`
	SenderLastName       string  `json:"senderLastName"`
	SenderPhone          string  `json:"senderPhone,omitempty"`
	CountryTo            string  `json:"countryTo"`
	CountryFrom          string  `json:"countryFrom"`
	SendingCurrency      string  `json:"sendingCurrency"`
	ReceivingCurrency    string  `json:"receivingCurrency"`
	DestinationAmount    float64 `json:"destinationAmount"`
	BeneficiaryFirstName string  `json:"beneficiaryFirstName"`
	BeneficiaryMiddleName string `json:"beneficiaryMiddleName,omitempty"`
	BeneficiaryLastName  string  `json:"beneficiaryLastName"`
	TransferType         string  `json:"transferType"`
	BankAccountNumber    string  `json:"bankAccountNumber,omitempty"`
	BankName             string  `json:"bankName,omitempty"`
	BankBranch           string  `json:"bankBranch,omitempty"`
	BankCode             string  `json:"bankCode,omitempty"`
	TransferReason       string  `json:"transferReason"`
	Ref                  string  `json:"ref"`
	PurposeDetails       string  `json:"purposeDetails,omitempty"`
}

func main() {
	// Create request payload
	requestData := DisbursementRequest{
		TransactionId:        "PAY-123456789",
		SenderFirstName:      "John",
		SenderLastName:       "Doe",
		SenderPhone:          "+16175551234",
		CountryTo:            "GH",
		CountryFrom:          "US",
		SendingCurrency:      "USD",
		ReceivingCurrency:    "GHS",
		DestinationAmount:    1000,
		BeneficiaryFirstName: "Jane",
		BeneficiaryLastName:  "Smith",
		TransferType:         "Bank",
		BankAccountNumber:    "1234567890",
		BankName:             "STANDARD CHARTERED BANK",
		BankBranch:           "HIGH STREET",
		BankCode:             "300302",
		TransferReason:       "Family Support",
		Ref:                  "INV-001-PAYMENT",
		PurposeDetails:       "Monthly allowance",
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
                + "\"transactionId\": \"PAY-123456789\","
                + "\"senderFirstName\": \"John\","
                + "\"senderLastName\": \"Doe\","
                + "\"senderPhone\": \"+16175551234\","
                + "\"countryTo\": \"GH\","
                + "\"countryFrom\": \"US\","
                + "\"sendingCurrency\": \"USD\","
                + "\"receivingCurrency\": \"GHS\","
                + "\"destinationAmount\": 1000,"
                + "\"beneficiaryFirstName\": \"Jane\","
                + "\"beneficiaryLastName\": \"Smith\","
                + "\"transferType\": \"Bank\","
                + "\"bankAccountNumber\": \"1234567890\","
                + "\"bankName\": \"STANDARD CHARTERED BANK\","
                + "\"bankBranch\": \"HIGH STREET\","
                + "\"bankCode\": \"300302\","
                + "\"transferReason\": \"Family Support\","
                + "\"ref\": \"INV-001-PAYMENT\","
                + "\"purposeDetails\": \"Monthly allowance\""
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
      transactionId: "PAY-987654321",
      senderFirstName: "John",
      senderLastName: "Doe",
      senderPhone: "+16175551234",
      countryTo: "GH",
      countryFrom: "US",
      sendingCurrency: "USD",
      receivingCurrency: "GHS",
      destinationAmount: 500,
      beneficiaryFirstName: "Jane",
      beneficiaryLastName: "Smith",
      transferType: "Mobile",
      mobileNetwork: "MTN",
      mobileNumber: "0551234567",
      transferReason: "Gift",
      ref: "MOMO-PAYMENT-001",
      purposeDetails: "Birthday gift"
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