---
id: webhooks
title: Webhooks
sidebar_label: Webhooks
slug: /api/webhooks
---

# Webhooks

PayAngel uses webhooks to notify your application when events happen in your account. Webhooks are particularly useful for tracking the status of disbursement transactions, which may change from `PENDING` to `PROCESSING` to `COMPLETED` or `FAILED`.

## Setting Up Webhooks

You can register a webhook URL in two ways:

1. **In the Dashboard**: Log in to your PayAngel dashboard and navigate to the Developer > Webhook settings page.
2. **Per Transaction**: Include a `callback_url` parameter when creating single or bulk disbursements.

## Webhook Events

The PayAngel API sends webhook notifications for the following events:

| Event | Description |
|-------|-------------|
| `disbursement.pending` | A disbursement has been created and is pending processing |
| `disbursement.processing` | A disbursement is being processed |
| `disbursement.completed` | A disbursement has been successfully completed |
| `disbursement.failed` | A disbursement has failed |
| `disbursement.cancelled` | A disbursement has been cancelled |

## Webhook Payload

Webhook payloads are sent as HTTP POST requests with a JSON body. Here's an example of a webhook payload:

```json
{
  "event": "disbursement.completed",
  "data": {
    "transaction_id": "txn_123456789",
    "reference": "your-reference",
    "status": "COMPLETED",
    "amount": 1000,
    "currency": "GHS",
    "fee": 10,
    "total": 1010,
    "created_at": "2023-06-15T14:30:00Z",
    "updated_at": "2023-06-15T15:30:00Z",
    "completed_at": "2023-06-15T15:30:00Z"
  }
}
```

## Webhook Security

To ensure that webhook requests are coming from PayAngel, we include a signature in the `X-PayAngel-Signature` header. You should verify this signature to confirm the authenticity of the webhook.

### Verifying Webhook Signatures

The signature is a HMAC-SHA256 hash of the JSON payload, using your webhook secret as the key. Here's how to verify the signature:

#### JavaScript

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(signature)
  );
}

// Example usage in an Express.js app
app.post('/webhooks/payangel', (req, res) => {
  const signature = req.headers['x-payangel-signature'];
  const payload = req.body;
  const secret = 'your_webhook_secret';
  
  if (!signature || !verifyWebhookSignature(payload, signature, secret)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const { event, data } = payload;
  
  switch (event) {
    case 'disbursement.completed':
      // Handle completed disbursement
      console.log(`Transaction ${data.transaction_id} completed`);
      break;
    case 'disbursement.failed':
      // Handle failed disbursement
      console.log(`Transaction ${data.transaction_id} failed`);
      break;
    // Handle other events
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
});
```

#### TypeScript

```typescript
import * as crypto from 'crypto';
import express from 'express';

interface WebhookPayload {
  event: string;
  data: {
    transaction_id: string;
    reference: string;
    status: string;
    amount: number;
    currency: string;
    [key: string]: any;
  };
}

function verifyWebhookSignature(payload: any, signature: string, secret: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(signature)
  );
}

const app = express();
app.use(express.json());

app.post('/webhooks/payangel', (req, res) => {
  const signature = req.headers['x-payangel-signature'] as string;
  const payload = req.body as WebhookPayload;
  const secret = 'your_webhook_secret';
  
  if (!signature || !verifyWebhookSignature(payload, signature, secret)) {
    console.error('Invalid webhook signature');
    return res.status(401).send('Invalid signature');
  }
  
  // Process the webhook
  const { event, data } = payload;
  
  switch (event) {
    case 'disbursement.completed':
      // Handle completed disbursement
      console.log(`Transaction ${data.transaction_id} completed`);
      break;
    case 'disbursement.failed':
      // Handle failed disbursement
      console.log(`Transaction ${data.transaction_id} failed`);
      break;
    // Handle other events
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
```

#### Go

```go
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
)

type WebhookPayload struct {
	Event string `json:"event"`
	Data  struct {
		TransactionID string  `json:"transaction_id"`
		Reference     string  `json:"reference"`
		Status        string  `json:"status"`
		Amount        float64 `json:"amount"`
		Currency      string  `json:"currency"`
	} `json:"data"`
}

func verifySignature(payload []byte, signature, secret string) bool {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write(payload)
	computedSignature := hex.EncodeToString(h.Sum(nil))
	return hmac.Equal([]byte(computedSignature), []byte(signature))
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	signature := r.Header.Get("X-PayAngel-Signature")
	if signature == "" {
		http.Error(w, "Missing signature header", http.StatusBadRequest)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	// Verify signature
	webhookSecret := "your_webhook_secret"
	if !verifySignature(body, signature, webhookSecret) {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	// Parse webhook payload
	var payload WebhookPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "Failed to parse webhook payload", http.StatusBadRequest)
		return
	}

	// Process the webhook
	switch payload.Event {
	case "disbursement.completed":
		log.Printf("Transaction %s completed", payload.Data.TransactionID)
		// Handle completed disbursement
	case "disbursement.failed":
		log.Printf("Transaction %s failed", payload.Data.TransactionID)
		// Handle failed disbursement
	default:
		log.Printf("Received webhook event: %s", payload.Event)
	}

	// Acknowledge receipt of the webhook
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Webhook received"))
}

func main() {
	http.HandleFunc("/webhooks/payangel", webhookHandler)
	log.Println("Webhook server listening on port 3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
```

#### Java

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import spark.Request;
import spark.Response;
import spark.Spark;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;

public class WebhookServer {
    private static final String WEBHOOK_SECRET = "your_webhook_secret";
    
    public static void main(String[] args) {
        Spark.port(3000);
        Spark.post("/webhooks/payangel", WebhookServer::handleWebhook);
    }
    
    private static Object handleWebhook(Request request, Response response) {
        try {
            // Get signature from header
            String signature = request.headers("X-PayAngel-Signature");
            if (signature == null || signature.isEmpty()) {
                response.status(400);
                return "Missing signature header";
            }
            
            // Get request body
            String body = request.body();
            
            // Verify signature
            if (!verifySignature(body, signature)) {
                response.status(401);
                return "Invalid signature";
            }
            
            // Parse webhook payload
            ObjectMapper mapper = new ObjectMapper();
            JsonNode payload = mapper.readTree(body);
            
            String event = payload.get("event").asText();
            JsonNode data = payload.get("data");
            String transactionId = data.get("transaction_id").asText();
            
            // Process the webhook
            switch (event) {
                case "disbursement.completed":
                    System.out.println("Transaction " + transactionId + " completed");
                    // Handle completed disbursement
                    break;
                case "disbursement.failed":
                    System.out.println("Transaction " + transactionId + " failed");
                    // Handle failed disbursement
                    break;
                default:
                    System.out.println("Received webhook event: " + event);
            }
            
            // Acknowledge receipt of the webhook
            response.status(200);
            return "Webhook received";
        } catch (Exception e) {
            e.printStackTrace();
            response.status(500);
            return "Internal server error";
        }
    }
    
    private static boolean verifySignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedSignature = toHexString(hash);
            
            return computedSignature.equals(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private static String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }
}
```

## Best Practices for Webhooks

1. **Verify signatures** - Always verify webhook signatures to ensure they come from PayAngel
2. **Respond quickly** - Your webhook endpoint should respond within a few seconds
3. **Process asynchronously** - Handle complex processing outside the HTTP request cycle
4. **Implement idempotency** - Handle duplicate webhook notifications gracefully
5. **Store the raw payload** - Store the raw webhook payload for debugging and reference
6. **Monitor webhook failures** - Set up monitoring for webhook processing failures
7. **Implement retry logic** - PayAngel retries failed webhook deliveries, but you can implement your own retry logic too

## Testing Webhooks

For testing webhooks locally, you can use tools like [ngrok](https://ngrok.com/) to expose your local server to the internet. This allows PayAngel to send webhook notifications to your local development environment.

### Example with ngrok

1. Start your local webhook server:
   ```
   node webhook-server.js
   ```

2. Start ngrok to expose your local server:
   ```
   ngrok http 3000
   ```

3. Use the ngrok URL (e.g., `https://abc123.ngrok.io/webhooks/payangel`) as your webhook URL when testing PayAngel API calls.
