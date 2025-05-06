---
id: authentication
title: Authentication
sidebar_label: Authentication
slug: /api/authentication
---

# Authentication

The PayAngel API uses API keys to authenticate requests. You can view and manage your API keys in the PayAngel Developer Dashboard.

Authentication is performed via HTTP Bearer Auth. All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail.

## Obtaining API Keys

1. Sign in to your [PayAngel Developer Dashboard](https://dashboard.payangel.com)
2. Navigate to the API section
3. Generate a new API key
4. Store your API key securely; it won't be displayed again

## Authentication Header

All API requests must include your API key in the Authorization header:

```
Authorization: Bearer YOUR_API_KEY
```

## Example Request

Here's an example of how to authenticate your API requests:

### JavaScript

```javascript
const fetch = require('node-fetch');

async function fetchPayAngelAPI() {
  const response = await fetch('https://api.payangel.com/v1/accounts', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  console.log(data);
}

fetchPayAngelAPI();
```

### TypeScript

```typescript
import fetch from 'node-fetch';

async function fetchPayAngelAPI(): Promise<any> {
  const response = await fetch('https://api.payangel.com/v1/accounts', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}

fetchPayAngelAPI()
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Go

```go
package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func main() {
	url := "https://api.payangel.com/v1/accounts"
	
	// Create a new request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	
	// Add authorization header
	req.Header.Add("Authorization", "Bearer YOUR_API_KEY")
	req.Header.Add("Content-Type", "application/json")
	
	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()
	
	// Read response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response:", err)
		return
	}
	
	fmt.Println(string(body))
}
```

### Java

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class PayAngelApiExample {
    public static void main(String[] args) {
        try {
            String apiUrl = "https://api.payangel.com/v1/accounts";
            URL url = new URL(apiUrl);
            
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Authorization", "Bearer YOUR_API_KEY");
            conn.setRequestProperty("Content-Type", "application/json");
            
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            
            System.out.println(response.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## API Environments

PayAngel provides two environments for API integration:

| Environment | Base URL |
|-------------|----------|
| Sandbox | `https://sandbox-api.payangel.com/v1` |
| Production | `https://api.payangel.com/v1` |

For development and testing, use the sandbox environment. Once you're ready to go live, switch to the production environment.

## Security Recommendations

- Keep your API keys secure and never expose them in client-side code
- Rotate your API keys periodically
- Use environment variables to store API keys in your applications
- Monitor your API usage regularly for any suspicious activity