---
id: examples
title: Java Code Examples
sidebar_label: Java Examples
slug: /api/java/examples
---

# Java Code Examples

This section provides examples of how to use the PayAngel API with Java.

## Prerequisites

- Java 8 or higher
- Maven or Gradle for dependency management

## Project Setup

### Maven Configuration

```xml
<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>payangel-integration</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Dependencies -->
        <okhttp.version>4.9.1</okhttp.version>
        <jackson.version>2.13.0</jackson.version>
        <lombok.version>1.18.22</lombok.version>
        <slf4j.version>1.7.32</slf4j.version>
        <logback.version>1.2.6</logback.version>
    </properties>

    <dependencies>
        <!-- HTTP Client -->
        <dependency>
            <groupId>com.squareup.okhttp3</groupId>
            <artifactId>okhttp</artifactId>
            <version>${okhttp.version}</version>
        </dependency>
        
        <!-- JSON Processing -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>
        
        <!-- Lombok for boilerplate reduction -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
            <scope>provided</scope>
        </dependency>
        
        <!-- Logging -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>
        
        <!-- For Webhook Server -->
        <dependency>
            <groupId>com.sparkjava</groupId>
            <artifactId>spark-core</artifactId>
            <version>2.9.3</version>
        </dependency>
    </dependencies>
</project>
```

### Gradle Configuration

```groovy
// build.gradle
plugins {
    id 'java'
    id 'application'
}

group = 'com.example'
version = '1.0-SNAPSHOT'
sourceCompatibility = '1.8'

repositories {
    mavenCentral()
}

dependencies {
    // HTTP Client
    implementation 'com.squareup.okhttp3:okhttp:4.9.1'
    
    // JSON Processing
    implementation 'com.fasterxml.jackson.core:jackson-databind:2.13.0'
    
    // Lombok for boilerplate reduction
    compileOnly 'org.projectlombok:lombok:1.18.22'
    annotationProcessor 'org.projectlombok:lombok:1.18.22'
    
    // Logging
    implementation 'org.slf4j:slf4j-api:1.7.32'
    implementation 'ch.qos.logback:logback-classic:1.2.6'
    
    // For Webhook Server
    implementation 'com.sparkjava:spark-core:2.9.3'
}

application {
    mainClassName = 'com.example.payangel.PayAngelDemo'
}
```

## Model Classes

Create Java models for the PayAngel API:

```java
// src/main/java/com/example/payangel/model/Recipient.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Recipient {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String bankCode;
    private String accountNumber;
    private String mobileNetwork;
    private String mobileNumber;
}
```

```java
// src/main/java/com/example/payangel/model/SingleDisbursementRequest.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SingleDisbursementRequest {
    private String reference;
    private double amount;
    private String currency;
    
    @JsonProperty("source_account")
    private String sourceAccount;
    
    @JsonProperty("destination_type")
    private String destinationType;
    
    private Recipient recipient;
    private String narration;
    
    @JsonProperty("callback_url")
    private String callbackUrl;
}
```

```java
// src/main/java/com/example/payangel/model/Transaction.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Transaction {
    private String reference;
    private double amount;
    private String currency;
    
    @JsonProperty("destination_type")
    private String destinationType;
    
    private Recipient recipient;
    private String narration;
}
```

```java
// src/main/java/com/example/payangel/model/BulkDisbursementRequest.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BulkDisbursementRequest {
    @JsonProperty("batch_reference")
    private String batchReference;
    
    @JsonProperty("source_account")
    private String sourceAccount;
    
    @JsonProperty("callback_url")
    private String callbackUrl;
    
    private List<Transaction> transactions;
}
```

```java
// src/main/java/com/example/payangel/model/TransactionResponse.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class TransactionResponse {
    @JsonProperty("transaction_id")
    private String transactionId;
    
    private String reference;
    private double amount;
    private double fee;
    private double total;
    private String currency;
    private String status;
    
    @JsonProperty("created_at")
    private String createdAt;
    
    @JsonProperty("estimated_delivery")
    private String estimatedDelivery;
}
```

```java
// src/main/java/com/example/payangel/model/BulkResponse.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class BulkResponse {
    @JsonProperty("batch_id")
    private String batchId;
    
    private List<TransactionResponse> transactions;
}
```

```java
// src/main/java/com/example/payangel/model/AccountBalance.java
package com.example.payangel.model;

import lombok.Data;

@Data
public class AccountBalance {
    private double available;
    private String currency;
}
```

```java
// src/main/java/com/example/payangel/model/ApiResponse.java
package com.example.payangel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;
    private List<ErrorField> errors;
    
    @Data
    public static class ErrorField {
        private String field;
        private String message;
    }
}
```

## API Client

Create a Java client for the PayAngel API:

```java
// src/main/java/com/example/payangel/client/PayAngelClient.java
package com.example.payangel.client;

import com.example.payangel.exception.PayAngelApiException;
import com.example.payangel.model.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
public class PayAngelClient {
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String baseUrl;
    
    public PayAngelClient(String apiKey) {
        this(apiKey, "https://api.payangel.com/v1");
    }
    
    public PayAngelClient(String apiKey, String baseUrl) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        
        this.httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();
        
        this.objectMapper = new ObjectMapper();
    }
    
    public AccountBalance getAccountBalance() throws PayAngelApiException {
        Request request = new Request.Builder()
            .url(baseUrl + "/accounts/balance")
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .get()
            .build();
        
        return executeRequest(request, new TypeReference<ApiResponse<AccountBalance>>() {})
            .getData();
    }
    
    public TransactionResponse createSingleDisbursement(SingleDisbursementRequest disbursementRequest) 
            throws PayAngelApiException {
        RequestBody requestBody = RequestBody.create(
            objectMapper.writeValueAsString(disbursementRequest),
            MediaType.parse("application/json")
        );
        
        Request request = new Request.Builder()
            .url(baseUrl + "/disbursements/single")
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .post(requestBody)
            .build();
        
        return executeRequest(request, new TypeReference<ApiResponse<TransactionResponse>>() {})
            .getData();
    }
    
    public BulkResponse createBulkDisbursement(BulkDisbursementRequest bulkRequest) 
            throws PayAngelApiException {
        RequestBody requestBody = RequestBody.create(
            objectMapper.writeValueAsString(bulkRequest),
            MediaType.parse("application/json")
        );
        
        Request request = new Request.Builder()
            .url(baseUrl + "/disbursements/bulk")
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .post(requestBody)
            .build();
        
        return executeRequest(request, new TypeReference<ApiResponse<BulkResponse>>() {})
            .getData();
    }
    
    public TransactionResponse getTransactionStatus(String transactionId) 
            throws PayAngelApiException {
        Request request = new Request.Builder()
            .url(baseUrl + "/disbursements/" + transactionId)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .get()
            .build();
        
        return executeRequest(request, new TypeReference<ApiResponse<TransactionResponse>>() {})
            .getData();
    }
    
    public static class TransactionsListResponse {
        private int total;
        private int page;
        private int limit;
        private List<TransactionResponse> transactions;
        
        // Getters and setters
        public int getTotal() { return total; }
        public void setTotal(int total) { this.total = total; }
        
        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }
        
        public int getLimit() { return limit; }
        public void setLimit(int limit) { this.limit = limit; }
        
        public List<TransactionResponse> getTransactions() { return transactions; }
        public void setTransactions(List<TransactionResponse> transactions) { this.transactions = transactions; }
    }
    
    public TransactionsListResponse listTransactions(int page, int limit) 
            throws PayAngelApiException {
        Request request = new Request.Builder()
            .url(baseUrl + "/disbursements?page=" + page + "&limit=" + limit)
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .get()
            .build();
        
        return executeRequest(request, new TypeReference<ApiResponse<TransactionsListResponse>>() {})
            .getData();
    }
    
    public void cancelTransaction(String transactionId) throws PayAngelApiException {
        Request request = new Request.Builder()
            .url(baseUrl + "/disbursements/" + transactionId + "/cancel")
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .post(RequestBody.create(new byte[0], null))
            .build();
        
        executeRequest(request, new TypeReference<ApiResponse<Void>>() {});
    }
    
    private <T> ApiResponse<T> executeRequest(Request request, TypeReference<ApiResponse<T>> typeReference) 
            throws PayAngelApiException {
        try {
            Response response = httpClient.newCall(request).execute();
            String responseBody = response.body().string();
            
            if (!response.isSuccessful()) {
                ApiResponse<?> errorResponse = objectMapper.readValue(responseBody, 
                    new TypeReference<ApiResponse<?>>() {});
                
                throw new PayAngelApiException(
                    errorResponse.getMessage(),
                    response.code(),
                    errorResponse.getErrors()
                );
            }
            
            return objectMapper.readValue(responseBody, typeReference);
        } catch (IOException e) {
            throw new PayAngelApiException("Failed to execute request: " + e.getMessage(), e);
        }
    }
}
```

## Exception Handling

Create a custom exception for API errors:

```java
// src/main/java/com/example/payangel/exception/PayAngelApiException.java
package com.example.payangel.exception;

import com.example.payangel.model.ApiResponse;
import lombok.Getter;

import java.util.List;

@Getter
public class PayAngelApiException extends Exception {
    private final int statusCode;
    private final List<ApiResponse.ErrorField> errors;
    
    public PayAngelApiException(String message, int statusCode, List<ApiResponse.ErrorField> errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
    
    public PayAngelApiException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 0;
        this.errors = null;
    }
}
```

## Example Usage

Create a demo class to showcase the PayAngel API integration:

```java
// src/main/java/com/example/payangel/PayAngelDemo.java
package com.example.payangel;

import com.example.payangel.client.PayAngelClient;
import com.example.payangel.exception.PayAngelApiException;
import com.example.payangel.model.*;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
public class PayAngelDemo {
    private static final String API_KEY = "your_api_key_here"; // Replace with your actual API key
    
    public static void main(String[] args) {
        // Initialize PayAngel client
        PayAngelClient client = new PayAngelClient(API_KEY);
        // For sandbox environment
        // PayAngelClient client = new PayAngelClient(API_KEY, "https://sandbox-api.payangel.com/v1");
        
        try {
            // Check account balance
            AccountBalance balance = client.getAccountBalance();
            log.info("Account Balance: {} {}", balance.getAvailable(), balance.getCurrency());
            
            // Create a bank transfer
            TransactionResponse bankTransfer = createBankTransfer(client);
            log.info("Bank Transfer Created - Transaction ID: {}, Status: {}", 
                bankTransfer.getTransactionId(), bankTransfer.getStatus());
            
            // Create a mobile money transfer
            TransactionResponse mobileMoneyTransfer = createMobileMoneyTransfer(client);
            log.info("Mobile Money Transfer Created - Transaction ID: {}, Status: {}", 
                mobileMoneyTransfer.getTransactionId(), mobileMoneyTransfer.getStatus());
            
            // Create a bulk transfer
            BulkResponse bulkResponse = createBulkTransfer(client);
            log.info("Bulk Transfer Created - Batch ID: {}, Transactions: {}", 
                bulkResponse.getBatchId(), bulkResponse.getTransactions().size());
            
            // Check transaction status
            if (!bulkResponse.getTransactions().isEmpty()) {
                String transactionId = bulkResponse.getTransactions().get(0).getTransactionId();
                TransactionResponse status = client.getTransactionStatus(transactionId);
                log.info("Transaction Status: {}", status.getStatus());
            }
            
            // List transactions
            PayAngelClient.TransactionsListResponse transactions = client.listTransactions(1, 10);
            log.info("Total Transactions: {}", transactions.getTotal());
            for (int i = 0; i < transactions.getTransactions().size(); i++) {
                TransactionResponse tx = transactions.getTransactions().get(i);
                log.info("{}. {}: {} {} ({})", i + 1, tx.getTransactionId(), 
                    tx.getAmount(), tx.getCurrency(), tx.getStatus());
            }
            
        } catch (PayAngelApiException e) {
            log.error("API Error: {} (Status Code: {})", e.getMessage(), e.getStatusCode());
            if (e.getErrors() != null) {
                for (ApiResponse.ErrorField error : e.getErrors()) {
                    log.error("Field Error: {} - {}", error.getField(), error.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
        }
    }
    
    // Create a bank transfer
    private static TransactionResponse createBankTransfer(PayAngelClient client) throws PayAngelApiException {
        // Generate a unique reference
        String reference = "bank-transfer-" + UUID.randomUUID().toString().substring(0, 8);
        
        // Prepare the request
        SingleDisbursementRequest request = SingleDisbursementRequest.builder()
            .reference(reference)
            .amount(1000.00)
            .currency("GHS")
            .sourceAccount("acc_123456789")
            .destinationType("bank_account")
            .recipient(Recipient.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phone("+233501234567")
                .bankCode("GH123456")
                .accountNumber("1234567890")
                .build())
            .narration("Salary payment")
            .callbackUrl("https://your-website.com/webhooks/payangel")
            .build();
        
        return client.createSingleDisbursement(request);
    }
    
    // Create a mobile money transfer
    private static TransactionResponse createMobileMoneyTransfer(PayAngelClient client) throws PayAngelApiException {
        // Generate a unique reference
        String reference = "momo-transfer-" + UUID.randomUUID().toString().substring(0, 8);
        
        // Prepare the request
        SingleDisbursementRequest request = SingleDisbursementRequest.builder()
            .reference(reference)
            .amount(500.00)
            .currency("GHS")
            .sourceAccount("acc_123456789")
            .destinationType("mobile_money")
            .recipient(Recipient.builder()
                .name("Jane Smith")
                .phone("+233507654321")
                .mobileNetwork("MTN")
                .mobileNumber("0507654321")
                .build())
            .narration("Commission payment")
            .callbackUrl("https://your-website.com/webhooks/payangel")
            .build();
        
        return client.createSingleDisbursement(request);
    }
    
    // Create a bulk transfer
    private static BulkResponse createBulkTransfer(PayAngelClient client) throws PayAngelApiException {
        // Generate a unique batch reference
        String batchReference = "batch-" + UUID.randomUUID().toString().substring(0, 8);
        
        // Prepare transactions
        List<Transaction> transactions = new ArrayList<>();
        
        transactions.add(Transaction.builder()
            .reference("tx1-" + UUID.randomUUID().toString().substring(0, 8))
            .amount(1000.00)
            .currency("GHS")
            .destinationType("bank_account")
            .recipient(Recipient.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .phone("+233501234567")
                .bankCode("GH123456")
                .accountNumber("1234567890")
                .build())
            .narration("Salary payment")
            .build());
        
        transactions.add(Transaction.builder()
            .reference("tx2-" + UUID.randomUUID().toString().substring(0, 8))
            .amount(500.00)
            .currency("GHS")
            .destinationType("mobile_money")
            .recipient(Recipient.builder()
                .name("Jane Smith")
                .phone("+233507654321")
                .mobileNetwork("MTN")
                .mobileNumber("0507654321")
                .build())
            .narration("Commission payment")
            .build());
        
        // Prepare the request
        BulkDisbursementRequest request = BulkDisbursementRequest.builder()
            .batchReference(batchReference)
            .sourceAccount("acc_123456789")
            .callbackUrl("https://your-website.com/webhooks/payangel")
            .transactions(transactions)
            .build();
        
        return client.createBulkDisbursement(request);
    }
}
```

## Webhook Handler (with Spark Framework)

Create a webhook handler using the Spark framework:

```java
// src/main/java/com/example/payangel/webhook/WebhookServer.java
package com.example.payangel.webhook;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import spark.Spark;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Formatter;

@Slf4j
public class WebhookServer {
    private static final String WEBHOOK_SECRET = "your_webhook_secret_here"; // Replace with your actual webhook secret
    private static final int PORT = 3000;
    
    public static void main(String[] args) {
        // Configure Spark to listen on the specified port
        Spark.port(PORT);
        
        // Route for PayAngel webhooks
        Spark.post("/webhooks/payangel", (request, response) -> {
            // Get the signature from headers
            String signature = request.headers("X-PayAngel-Signature");
            if (signature == null || signature.isEmpty()) {
                response.status(400);
                return "Missing signature header";
            }
            
            // Get the request body
            String body = request.body();
            
            // Verify the signature
            if (!verifySignature(body, signature)) {
                response.status(401);
                return "Invalid signature";
            }
            
            // Parse the webhook payload
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode payload = objectMapper.readTree(body);
            
            String event = payload.get("event").asText();
            JsonNode data = payload.get("data");
            
            // Handle different event types
            switch (event) {
                case "disbursement.pending":
                    log.info("Transaction pending: {}", data.get("transaction_id").asText());
                    break;
                case "disbursement.processing":
                    log.info("Transaction processing: {}", data.get("transaction_id").asText());
                    break;
                case "disbursement.completed":
                    log.info("Transaction completed: {}", data.get("transaction_id").asText());
                    // Update your database or notify your users
                    break;
                case "disbursement.failed":
                    log.info("Transaction failed: {}, Reason: {}", 
                        data.get("transaction_id").asText(), 
                        data.has("failure_reason") ? data.get("failure_reason").asText() : "Unknown");
                    // Handle the failure
                    break;
                default:
                    log.info("Unhandled event: {}", event);
            }
            
            // Acknowledge receipt of the webhook
            response.status(200);
            return "Webhook received";
        });
        
        log.info("Webhook server listening on port {}", PORT);
    }
    
    // Verify webhook signature
    private static boolean verifySignature(String payload, String signature) {
        try {
            // Create HMAC-SHA256 instance with the webhook secret
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            // Compute the HMAC
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            
            // Convert the HMAC to a hex string
            String expectedSignature = toHexString(hash);
            
            // Compare the computed signature with the provided signature
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Failed to verify signature: {}", e.getMessage(), e);
            return false;
        }
    }
    
    // Convert byte array to hex string
    private static String toHexString(byte[] bytes) {
        try (Formatter formatter = new Formatter()) {
            for (byte b : bytes) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        }
    }
}
```

## Logging Configuration

Create a Logback configuration file:

```xml
<!-- src/main/resources/logback.xml -->
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/payangel.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/payangel.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <root level="INFO">
        <appender-ref ref="CONSOLE" />
        <appender-ref ref="FILE" />
    </root>
</configuration>
```

## Complete Project Structure

Here's a recommended project structure for a Java application using the PayAngel API:

```
payangel-integration/
├── pom.xml (or build.gradle)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── payangel/
│   │   │               ├── PayAngelDemo.java
│   │   │               ├── client/
│   │   │               │   └── PayAngelClient.java
│   │   │               ├── exception/
│   │   │               │   └── PayAngelApiException.java
│   │   │               ├── model/
│   │   │               │   ├── AccountBalance.java
│   │   │               │   ├── ApiResponse.java
│   │   │               │   ├── BulkDisbursementRequest.java
│   │   │               │   ├── BulkResponse.java
│   │   │               │   ├── Recipient.java
│   │   │               │   ├── SingleDisbursementRequest.java
│   │   │               │   ├── Transaction.java
│   │   │               │   └── TransactionResponse.java
│   │   │               └── webhook/
│   │   │                   └── WebhookServer.java
│   │   └── resources/
│   │       └── logback.xml
│   └── test/
│       └── java/
│           └── com/
│               └── example/
│                   └── payangel/
│                       └── client/
│                           └── PayAngelClientTest.java
└── logs/
    └── payangel.log
```