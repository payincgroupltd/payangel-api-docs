---
id: errors
title: API Errors
sidebar_label: Errors
slug: /api/errors
---

# API Errors

This page provides information about the error codes and messages that may be returned by the PayAngel API.

## Error Response Format

Error responses from the PayAngel API follow a consistent format:

```json
{
  "status": "error",
  "message": "A human-readable error message",
  "errors": [
    {
      "field": "The field that caused the error",
      "message": "Specific error message for this field"
    }
  ]
}
```

- `status`: Always "error" for error responses
- `message`: A general error message describing the problem
- `errors`: An array of specific validation errors, each with a `field` and `message`

## HTTP Status Codes

The PayAngel API uses standard HTTP status codes to indicate the success or failure of an API request.

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | The request was successful |
| 400 | Bad Request | The request was invalid or cannot be processed |
| 401 | Unauthorized | Authentication failed or was not provided |
| 403 | Forbidden | The authenticated user doesn't have permission |
| 404 | Not Found | The requested resource was not found |
| 409 | Conflict | The request conflicts with the current state |
| 422 | Unprocessable Entity | Validation error in the request |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | An error occurred on the server |

## Common Error Codes

### Authentication Errors

| Error Code | Description |
|------------|-------------|
| `invalid_api_key` | The API key provided is invalid |
| `expired_api_key` | The API key has expired |
| `missing_api_key` | No API key was provided in the request |

### Validation Errors

| Error Code | Description |
|------------|-------------|
| `required_field` | A required field is missing |
| `invalid_format` | The field value format is invalid |
| `invalid_amount` | The amount is invalid (e.g., negative, zero, or too large) |
| `invalid_currency` | The currency code is not supported |
| `invalid_account` | The account number is invalid |
| `invalid_bank_code` | The bank code is invalid |
| `invalid_mobile_number` | The mobile number is invalid |
| `invalid_reference` | The reference is invalid or already used |

### Resource Errors

| Error Code | Description |
|------------|-------------|
| `transaction_not_found` | The specified transaction was not found |
| `account_not_found` | The specified account was not found |
| `insufficient_funds` | The source account has insufficient funds |
| `recipient_not_found` | The recipient was not found |

### Rate Limiting

| Error Code | Description |
|------------|-------------|
| `rate_limit_exceeded` | You have exceeded the API rate limit |

## Error Handling Examples

### JavaScript / TypeScript

```javascript
async function makeApiCall() {
  try {
    const response = await fetch('https://api.payangel.com/v1/disbursements/single', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Request data here
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Handle error response
      console.error(`Error: ${data.message}`);
      
      if (data.errors) {
        data.errors.forEach(error => {
          console.error(`- ${error.field}: ${error.message}`);
        });
      }
      
      // Handle specific status codes
      switch (response.status) {
        case 401:
          console.error('Authentication failed. Please check your API key.');
          break;
        case 422:
          console.error('Validation error. Please check your input data.');
          break;
        case 429:
          console.error('Rate limit exceeded. Please try again later.');
          break;
        // Handle other status codes
      }
      
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}
```

### Go

```go
func handleApiError(resp *http.Response) error {
	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("error reading response body: %w", err)
	}
	
	// Parse error response
	var errorResponse struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Errors  []struct {
			Field   string `json:"field"`
			Message string `json:"message"`
		} `json:"errors"`
	}
	
	if err := json.Unmarshal(body, &errorResponse); err != nil {
		return fmt.Errorf("error parsing error response: %w", err)
	}
	
	// Build error message
	errorMsg := fmt.Sprintf("API error (%d): %s", resp.StatusCode, errorResponse.Message)
	
	// Add specific field errors if available
	if len(errorResponse.Errors) > 0 {
		errorMsg += ". Fields:"
		for _, fieldError := range errorResponse.Errors {
			errorMsg += fmt.Sprintf(" %s: %s;", fieldError.Field, fieldError.Message)
		}
	}
	
	return errors.New(errorMsg)
}
```

### Java

```java
private void handleApiError(Response response) throws IOException {
    ResponseBody errorBody = response.body();
    if (errorBody == null) {
        throw new ApiException("Unknown error occurred", response.code(), null);
    }
    
    String errorBodyString = errorBody.string();
    ObjectMapper objectMapper = new ObjectMapper();
    
    try {
        JsonNode rootNode = objectMapper.readTree(errorBodyString);
        String message = rootNode.path("message").asText("Unknown error");
        
        List<FieldError> fieldErrors = new ArrayList<>();
        JsonNode errorsNode = rootNode.path("errors");
        if (errorsNode.isArray()) {
            for (JsonNode errorNode : errorsNode) {
                String field = errorNode.path("field").asText();
                String fieldMessage = errorNode.path("message").asText();
                fieldErrors.add(new FieldError(field, fieldMessage));
            }
        }
        
        throw new ApiException(message, response.code(), fieldErrors);
    } catch (JsonProcessingException e) {
        throw new ApiException("Failed to parse error response", response.code(), null);
    }
}

public class ApiException extends Exception {
    private final int statusCode;
    private final List<FieldError> fieldErrors;
    
    public ApiException(String message, int statusCode, List<FieldError> fieldErrors) {
        super(message);
        this.statusCode = statusCode;
        this.fieldErrors = fieldErrors;
    }
    
    // Getters
}

public class FieldError {
    private final String field;
    private final String message;
    
    public FieldError(String field, String message) {
        this.field = field;
        this.message = message;
    }
    
    // Getters
}
```

## Best Practices for Error Handling

1. **Always check for error responses** - Don't assume the API call will succeed
2. **Log detailed error information** - Include the error code, message, and field errors
3. **Handle specific error cases** - Some errors may require specific handling (e.g., retry on rate limit)
4. **Show user-friendly messages** - Translate API errors into user-friendly messages
5. **Implement exponential backoff** - For rate limit errors, implement exponential backoff