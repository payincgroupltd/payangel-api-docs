---
id: examples
title: Go Code Examples
sidebar_label: Go Examples
slug: /api/golang/examples
---

# Go Code Examples

This section provides examples of how to use the PayAngel API with Go.

## Prerequisites

- Go 1.16 or higher

## Project Setup

First, create a new Go module:

```bash
mkdir payangel-integration
cd payangel-integration
go mod init github.com/yourusername/payangel-integration
```

## PayAngel Client

Create a Go client for the PayAngel API:

```go
// payangel/client.go
package payangel

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

// Client represents a PayAngel API client
type Client struct {
	apiKey  string
	baseURL string
	httpClient *http.Client
}

// NewClient creates a new PayAngel API client
func NewClient(apiKey string, baseURL string) *Client {
	if baseURL == "" {
		baseURL = "https://api.payangel.com/v1"
	}
	
	return &Client{
		apiKey:  apiKey,
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: time.Second * 30,
		},
	}
}

// createRequest constructs an HTTP request with authorization header
func (c *Client) createRequest(method, path string, body interface{}) (*http.Request, error) {
	url := fmt.Sprintf("%s%s", c.baseURL, path)
	
	var buf bytes.Buffer
	if body != nil {
		err := json.NewEncoder(&buf).Encode(body)
		if err != nil {
			return nil, fmt.Errorf("failed to encode request body: %w", err)
		}
	}
	
	req, err := http.NewRequest(method, url, &buf)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	
	return req, nil
}

// sendRequest sends an HTTP request and returns the response
func (c *Client) sendRequest(req *http.Request, v interface{}) error {
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()
	
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response body: %w", err)
	}
	
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		var errResp ErrorResponse
		if err := json.Unmarshal(body, &errResp); err != nil {
			return fmt.Errorf("failed to parse error response: %w", err)
		}
		return &APIError{
			StatusCode: resp.StatusCode,
			Message:    errResp.Message,
			Errors:     errResp.Errors,
		}
	}
	
	if v != nil {
		if err := json.Unmarshal(body, v); err != nil {
			return fmt.Errorf("failed to parse response: %w", err)
		}
	}
	
	return nil
}
```

## Type Definitions

Define the necessary types for interacting with the API:

```go
// payangel/types.go
package payangel

// Response represents a generic API response
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Recipient represents a disbursement recipient
type Recipient struct {
	Name           string `json:"name"`
	Email          string `json:"email,omitempty"`
	Phone          string `json:"phone"`
	Address        string `json:"address,omitempty"`
	BankCode       string `json:"bank_code,omitempty"`
	AccountNumber  string `json:"account_number,omitempty"`
	MobileNetwork  string `json:"mobile_network,omitempty"`
	MobileNumber   string `json:"mobile_number,omitempty"`
}

// SingleDisbursementRequest represents a single disbursement request
type SingleDisbursementRequest struct {
	Reference       string    `json:"reference"`
	Amount          float64   `json:"amount"`
	Currency        string    `json:"currency"`
	SourceAccount   string    `json:"source_account"`
	DestinationType string    `json:"destination_type"`
	Recipient       Recipient `json:"recipient"`
	Narration       string    `json:"narration"`
	CallbackURL     string    `json:"callback_url,omitempty"`
}

// Transaction represents a transaction in a bulk disbursement
type Transaction struct {
	Reference       string    `json:"reference"`
	Amount          float64   `json:"amount"`
	Currency        string    `json:"currency"`
	DestinationType string    `json:"destination_type"`
	Recipient       Recipient `json:"recipient"`
	Narration       string    `json:"narration"`
}

// BulkDisbursementRequest represents a bulk disbursement request
type BulkDisbursementRequest struct {
	BatchReference string        `json:"batch_reference"`
	SourceAccount  string        `json:"source_account"`
	CallbackURL    string        `json:"callback_url,omitempty"`
	Transactions   []Transaction `json:"transactions"`
}

// TransactionResponse represents a transaction response
type TransactionResponse struct {
	TransactionID      string    `json:"transaction_id"`
	Reference          string    `json:"reference"`
	Amount             float64   `json:"amount"`
	Fee                float64   `json:"fee"`
	Total              float64   `json:"total"`
	Currency           string    `json:"currency"`
	Status             string    `json:"status"`
	CreatedAt          string    `json:"created_at"`
	EstimatedDelivery  string    `json:"estimated_delivery"`
}

// BulkResponse represents a bulk disbursement response
type BulkResponse struct {
	BatchID      string                `json:"batch_id"`
	Transactions []TransactionResponse `json:"transactions"`
}

// AccountBalance represents an account balance response
type AccountBalance struct {
	Available float64 `json:"available"`
	Currency  string  `json:"currency"`
}

// ErrorField represents a field error
type ErrorField struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Status  string       `json:"status"`
	Message string       `json:"message"`
	Errors  []ErrorField `json:"errors,omitempty"`
}

// APIError represents an API error
type APIError struct {
	StatusCode int
	Message    string
	Errors     []ErrorField
}

// Error implements the error interface
func (e *APIError) Error() string {
	return fmt.Sprintf("API error (status %d): %s", e.StatusCode, e.Message)
}
```

## API Methods

Implement methods for interacting with the PayAngel API:

```go
// payangel/disbursement.go
package payangel

import (
	"fmt"
	"net/http"
)

// GetAccountBalance fetches the account balance
func (c *Client) GetAccountBalance() (*AccountBalance, error) {
	req, err := c.createRequest(http.MethodGet, "/accounts/balance", nil)
	if err != nil {
		return nil, err
	}
	
	var response struct {
		Status  string         `json:"status"`
		Message string         `json:"message"`
		Data    AccountBalance `json:"data"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return nil, err
	}
	
	return &response.Data, nil
}

// CreateSingleDisbursement creates a single disbursement
func (c *Client) CreateSingleDisbursement(data SingleDisbursementRequest) (*TransactionResponse, error) {
	req, err := c.createRequest(http.MethodPost, "/disbursements/single", data)
	if err != nil {
		return nil, err
	}
	
	var response struct {
		Status  string             `json:"status"`
		Message string             `json:"message"`
		Data    TransactionResponse `json:"data"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return nil, err
	}
	
	return &response.Data, nil
}

// CreateBulkDisbursement creates a bulk disbursement
func (c *Client) CreateBulkDisbursement(data BulkDisbursementRequest) (*BulkResponse, error) {
	req, err := c.createRequest(http.MethodPost, "/disbursements/bulk", data)
	if err != nil {
		return nil, err
	}
	
	var response struct {
		Status  string       `json:"status"`
		Message string       `json:"message"`
		Data    BulkResponse `json:"data"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return nil, err
	}
	
	return &response.Data, nil
}

// GetTransactionStatus fetches the status of a transaction
func (c *Client) GetTransactionStatus(transactionID string) (*TransactionResponse, error) {
	path := fmt.Sprintf("/disbursements/%s", transactionID)
	req, err := c.createRequest(http.MethodGet, path, nil)
	if err != nil {
		return nil, err
	}
	
	var response struct {
		Status  string             `json:"status"`
		Message string             `json:"message"`
		Data    TransactionResponse `json:"data"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return nil, err
	}
	
	return &response.Data, nil
}

// ListTransactions lists disbursement transactions
func (c *Client) ListTransactions(page, limit int) ([]TransactionResponse, int, error) {
	path := fmt.Sprintf("/disbursements?page=%d&limit=%d", page, limit)
	req, err := c.createRequest(http.MethodGet, path, nil)
	if err != nil {
		return nil, 0, err
	}
	
	var response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Data    struct {
			Total        int                  `json:"total"`
			Page         int                  `json:"page"`
			Limit        int                  `json:"limit"`
			Transactions []TransactionResponse `json:"transactions"`
		} `json:"data"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return nil, 0, err
	}
	
	return response.Data.Transactions, response.Data.Total, nil
}

// CancelTransaction cancels a pending transaction
func (c *Client) CancelTransaction(transactionID string) error {
	path := fmt.Sprintf("/disbursements/%s/cancel", transactionID)
	req, err := c.createRequest(http.MethodPost, path, nil)
	if err != nil {
		return err
	}
	
	var response struct {
		Status  string `json:"status"`
		Message string `json:"message"`
	}
	
	if err := c.sendRequest(req, &response); err != nil {
		return err
	}
	
	return nil
}
```

## Example Usage

Create a main file to demonstrate using the PayAngel client:

```go
// main.go
package main

import (
	"fmt"
	"log"
	"time"
	
	"github.com/yourusername/payangel-integration/payangel"
)

func main() {
	// Initialize the PayAngel client
	apiKey := "your_api_key_here" // Replace with your actual API key
	client := payangel.NewClient(apiKey, "")
	
	// For sandbox environment
	// client := payangel.NewClient(apiKey, "https://sandbox-api.payangel.com/v1")
	
	// Check account balance
	balance, err := client.GetAccountBalance()
	if err != nil {
		log.Fatalf("Failed to get account balance: %v", err)
	}
	fmt.Printf("Account Balance: %.2f %s\n", balance.Available, balance.Currency)
	
	// Create a single disbursement (bank transfer)
	bankTransfer, err := createBankTransfer(client)
	if err != nil {
		log.Fatalf("Failed to create bank transfer: %v", err)
	}
	fmt.Printf("Bank Transfer Created - Transaction ID: %s, Status: %s\n", 
		bankTransfer.TransactionID, bankTransfer.Status)
	
	// Create a single disbursement (mobile money)
	mobileMoneyTransfer, err := createMobileMoneyTransfer(client)
	if err != nil {
		log.Fatalf("Failed to create mobile money transfer: %v", err)
	}
	fmt.Printf("Mobile Money Transfer Created - Transaction ID: %s, Status: %s\n", 
		mobileMoneyTransfer.TransactionID, mobileMoneyTransfer.Status)
	
	// Create a bulk disbursement
	bulkResponse, err := createBulkTransfer(client)
	if err != nil {
		log.Fatalf("Failed to create bulk transfer: %v", err)
	}
	fmt.Printf("Bulk Transfer Created - Batch ID: %s, Transactions: %d\n", 
		bulkResponse.BatchID, len(bulkResponse.Transactions))
	
	// Check transaction status
	if len(bulkResponse.Transactions) > 0 {
		transactionID := bulkResponse.Transactions[0].TransactionID
		status, err := client.GetTransactionStatus(transactionID)
		if err != nil {
			log.Printf("Failed to get transaction status: %v", err)
		} else {
			fmt.Printf("Transaction Status: %s\n", status.Status)
		}
	}
	
	// List transactions
	transactions, total, err := client.ListTransactions(1, 10)
	if err != nil {
		log.Printf("Failed to list transactions: %v", err)
	} else {
		fmt.Printf("Total Transactions: %d\n", total)
		for i, tx := range transactions {
			fmt.Printf("%d. %s: %.2f %s (%s)\n", i+1, tx.TransactionID, tx.Amount, tx.Currency, tx.Status)
		}
	}
}

// Create a bank transfer
func createBankTransfer(client *payangel.Client) (*payangel.TransactionResponse, error) {
	// Generate a unique reference
	reference := fmt.Sprintf("bank-transfer-%d", time.Now().Unix())
	
	// Prepare the request
	request := payangel.SingleDisbursementRequest{
		Reference:       reference,
		Amount:          1000.00,
		Currency:        "GHS",
		SourceAccount:   "acc_123456789",
		DestinationType: "bank_account",
		Recipient: payangel.Recipient{
			Name:          "John Doe",
			Email:         "john.doe@example.com",
			Phone:         "+233501234567",
			BankCode:      "GH123456",
			AccountNumber: "1234567890",
		},
		Narration:   "Salary payment",
		CallbackURL: "https://your-website.com/webhooks/payangel",
	}
	
	return client.CreateSingleDisbursement(request)
}

// Create a mobile money transfer
func createMobileMoneyTransfer(client *payangel.Client) (*payangel.TransactionResponse, error) {
	// Generate a unique reference
	reference := fmt.Sprintf("momo-transfer-%d", time.Now().Unix())
	
	// Prepare the request
	request := payangel.SingleDisbursementRequest{
		Reference:       reference,
		Amount:          500.00,
		Currency:        "GHS",
		SourceAccount:   "acc_123456789",
		DestinationType: "mobile_money",
		Recipient: payangel.Recipient{
			Name:          "Jane Smith",
			Phone:         "+233507654321",
			MobileNetwork: "MTN",
			MobileNumber:  "0507654321",
		},
		Narration:   "Commission payment",
		CallbackURL: "https://your-website.com/webhooks/payangel",
	}
	
	return client.CreateSingleDisbursement(request)
}

// Create a bulk transfer
func createBulkTransfer(client *payangel.Client) (*payangel.BulkResponse, error) {
	// Generate a unique batch reference
	batchReference := fmt.Sprintf("batch-%d", time.Now().Unix())
	
	// Prepare transactions
	transactions := []payangel.Transaction{
		{
			Reference:       fmt.Sprintf("tx1-%d", time.Now().Unix()),
			Amount:          1000.00,
			Currency:        "GHS",
			DestinationType: "bank_account",
			Recipient: payangel.Recipient{
				Name:          "John Doe",
				Email:         "john.doe@example.com",
				Phone:         "+233501234567",
				BankCode:      "GH123456",
				AccountNumber: "1234567890",
			},
			Narration: "Salary payment",
		},
		{
			Reference:       fmt.Sprintf("tx2-%d", time.Now().Unix()),
			Amount:          500.00,
			Currency:        "GHS",
			DestinationType: "mobile_money",
			Recipient: payangel.Recipient{
				Name:          "Jane Smith",
				Phone:         "+233507654321",
				MobileNetwork: "MTN",
				MobileNumber:  "0507654321",
			},
			Narration: "Commission payment",
		},
	}
	
	// Prepare the request
	request := payangel.BulkDisbursementRequest{
		BatchReference: batchReference,
		SourceAccount:  "acc_123456789",
		CallbackURL:    "https://your-website.com/webhooks/payangel",
		Transactions:   transactions,
	}
	
	return client.CreateBulkDisbursement(request)
}
```

## Webhook Handler (with Gin Framework)

Install the Gin web framework:

```bash
go get github.com/gin-gonic/gin
```

Create a webhook handler:

```go
// webhook.go
package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// WebhookPayload represents the webhook payload
type WebhookPayload struct {
	Event string `json:"event"`
	Data  struct {
		TransactionID string  `json:"transaction_id"`
		Reference     string  `json:"reference"`
		Status        string  `json:"status"`
		Amount        float64 `json:"amount"`
		Currency      string  `json:"currency"`
		FailureReason string  `json:"failure_reason,omitempty"`
	} `json:"data"`
}

// verifySignature verifies the webhook signature
func verifySignature(payload []byte, signature, secret string) bool {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write(payload)
	expectedSignature := hex.EncodeToString(h.Sum(nil))
	return hmac.Equal([]byte(expectedSignature), []byte(signature))
}

func startWebhookServer() {
	router := gin.Default()

	router.POST("/webhooks/payangel", func(c *gin.Context) {
		// Get the signature from headers
		signature := c.GetHeader("X-PayAngel-Signature")
		if signature == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing signature header"})
			return
		}

		// Read the request body
		body, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
			return
		}

		// Verify the signature
		webhookSecret := "your_webhook_secret_here" // Replace with your actual webhook secret
		if !verifySignature(body, signature, webhookSecret) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid signature"})
			return
		}

		// Parse the webhook payload
		var payload WebhookPayload
		if err := json.Unmarshal(body, &payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to parse webhook payload"})
			return
		}

		// Handle different event types
		switch payload.Event {
		case "disbursement.pending":
			log.Printf("Transaction pending: %s", payload.Data.TransactionID)
		case "disbursement.processing":
			log.Printf("Transaction processing: %s", payload.Data.TransactionID)
		case "disbursement.completed":
			log.Printf("Transaction completed: %s", payload.Data.TransactionID)
			// Update your database or notify your users
		case "disbursement.failed":
			log.Printf("Transaction failed: %s, Reason: %s", 
				payload.Data.TransactionID, payload.Data.FailureReason)
			// Handle the failure
		default:
			log.Printf("Unhandled event: %s", payload.Event)
		}

		// Acknowledge receipt of the webhook
		c.JSON(http.StatusOK, gin.H{"message": "Webhook received"})
	})

	port := 3000
	log.Printf("Webhook server listening on port %d", port)
	if err := router.Run(fmt.Sprintf(":%d", port)); err != nil {
		log.Fatalf("Failed to start webhook server: %v", err)
	}
}

// Import this function in main.go and call it to start the webhook server
// go startWebhookServer() // Run in a separate goroutine
```

## Error Handling

Enhance error handling in your main application:

```go
// error_handling.go
package main

import (
	"fmt"
	"log"
	
	"github.com/yourusername/payangel-integration/payangel"
)

// handleAPIError handles PayAngel API errors
func handleAPIError(err error) {
	if apiErr, ok := err.(*payangel.APIError); ok {
		log.Printf("API Error (Status %d): %s", apiErr.StatusCode, apiErr.Message)
		
		// Handle specific error codes
		switch apiErr.StatusCode {
		case 401:
			log.Println("Authentication failed. Check your API key.")
		case 400:
			log.Println("Invalid request. Check your request parameters.")
			// Print individual field errors
			for _, fieldErr := range apiErr.Errors {
				log.Printf("Field Error: %s - %s", fieldErr.Field, fieldErr.Message)
			}
		case 429:
			log.Println("Rate limit exceeded. Please try again later.")
		case 500:
			log.Println("PayAngel server error. Please try again later.")
		}
	} else {
		log.Printf("Unexpected error: %v", err)
	}
}

// Example usage
func exampleWithErrorHandling(client *payangel.Client) {
	balance, err := client.GetAccountBalance()
	if err != nil {
		handleAPIError(err)
		return
	}
	
	fmt.Printf("Account Balance: %.2f %s\n", balance.Available, balance.Currency)
}
```

## Project Structure

Here's a recommended project structure for a Go application using the PayAngel API:

```
payangel-integration/
├── go.mod
├── go.sum
├── main.go                 # Main application entry point
├── webhook.go              # Webhook handler
├── error_handling.go       # Error handling utilities
└── payangel/
    ├── client.go           # PayAngel API client
    ├── types.go            # Type definitions
    └── disbursement.go     # Disbursement API methods
```