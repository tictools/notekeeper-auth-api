# Architecture Decisions Record

## 1. REPOSITORIES

In the context of an Express API, the repository pattern is used to separate the logic that retrieves data from the data source from the business logic. This pattern provides a central location to handle data operations and abstract away the details of the data access logic, making the codebase cleaner, more maintainable, and easier to test.

### 1.1 authRepository

The `authRepository` module is responsible for handling data operations related to user authentication. This includes creating new users, retrieving user information for login, and any other operations related to user data that the authentication endpoints require.

#### interface

```js
getUserByUsername(username: string) => Promise<User | null>;
createUser(name: string, username: string, password: string) => Promise<User>;
```

## 2. ENDPOINTS

### 2.1 `/auth`

This endpoint is used to:

- create a new user account. When a user wants to sign up for the service, they will need to provide necessary information, which will be validated and stored in the database.
- to authenticate a user. When a user wants to log in, they provide their credentials, which are then verified. Upon successful authentication, a token is issued that can be used for subsequent authenticated requests.

#### 2.1.1 Router

`authRouter` defines routes for auth actions

- `auth/register`
- `auth/login`

#### 2.1.2 Repository

This demo defines a `InMemoryAuthRepository`, which implements `authRepository`.

#### 2.1.3 Controller

`authController` must receive a repository implementing `authRepository` interface. This pattern ensures:

- dependency inversion: controller is agnostic to data layer access
- bindgin to abstraction: controller expects an `authRepository` object, which points to an interface (abstraction) not to a concrete implementation.

##### 2.1.3.1 authController.register

This controller is responsible to create a new user account, following these steps:

- **checks**:
  - _if user exists_, user is not created:
    - returns a response with message and status 409
  - _if user does not exist_, `authRepository.createUser` is called and a new user is created with:
    - `id`: you can use uuid for demo purpose
    - `username`: provided by request
    - `password`: it must be hashed using `bcrypt` (see encryption section)
    - returns a response with message and status 201
- **method:** POST
- **request:** data from client (req.body must be typed)
- **response:**

##### 2.1.3.2 authController.login

This controller is responsible to send token or reject login reque, following these steps:

- **checks**:
  - _if username does not exist_:
    - returns a response with _{ message: 'wrong credentials' }_ and status 401
  - _if password does not match hashed password_:
    - returns a response with _{ message: 'wrong credentials' }_ and status 401
  - _if username exists and password matches hashed password_:
    - create token using `jwt` (see tokenization section)
    - returns token with encoded username and id
- **method:** POST
- **request:** credentials
- **response:** token

#### 2.1.4 Middleware

In an Express API, middleware functions are functions that have access to the request object, the response object and the next middleware function in the application’s request-response cycle.

Middleware can execute any code, make changes to the request and response objects, end the request-response cycle, and call the next middleware function in the stack.

Middleware is used for various purposes such as logging, authentication, parsing request bodies, handling errors, and more.

In our case, the `authMiddleware` is used to protect certain routes by ensuring that the incoming requests include a valid JSON Web Token (JWT). It verifies the token and, if valid, allows the request to proceed to the protected route. If the token is invalid or absent, it responds with an error.

```js
import jwt from "jsonwebtoken";

const secretKey = "your_secret_key";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Let's assume the header is in the format "Bearer token"

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

## 3. SECURITY LAYER

### 3.1 Encryption :: `bcrypt`

bcrypt is a password hashing function designed for secure password storage. It incorporates a salt to protect against rainbow table attacks and includes a work factor to control the computational cost of hashing, making brute-force attacks more difficult.

#### 3.1.1 Key Features

- **Salted Hashing:** bcrypt generates a unique salt for each password, ensuring that even identical passwords have different hashes.
- **Work Factor:** The work factor (cost factor) can be adjusted to increase the time required to hash a password, enhancing security as computational power increases.
- **Secure:** bcrypt is resistant to various attacks such as brute-force and rainbow table attacks due to its use of salting and adjustable complexity.

#### 3.1.2 Usage example

```js
import bcrypt from "bcrypt";

// Hashing a password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash("plainPassword", saltRounds);

// Comparing a password
const match = await bcrypt.compare("plainPassword", hashedPassword);
```

> [!NOTE]  
> Import `@types/bcrypt` when working with TypeScript

> [!TIP]  
> Online Bcrypt Hash Generator & Checker: https://bcrypt-generator.com/

### 3.2 Tokenization :: `jwt`

JWT is a compact, URL-safe token format used for securely transmitting information between parties as a JSON object. It is widely used for authentication and authorization in web applications.

#### 3.2.1 Parts of a JWT

##### 3.2.1.1 Header

**The header specifies the token type and the algorithm used for signing. This allows the receiving party to understand how to process and verify the token.**

This part of the token typically consists of two parts: the type of token (JWT) and the signing algorithm being used (e.g., HMAC SHA256).

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

This header is Base64Url encoded to form the first part of the JWT.

##### 3.2.1.2 Payload

**The payload contains the actual data or claims. This is the part of the token that holds the information about the user or entity.**

There are three types of claims:

- **Registered claims:** Predefined claims like `iss` (issuer), `exp` (expiration time), `sub` (subject), `aud` (audience).
- **Public claims:** Custom claims defined by users.
- **Private claims:** Custom claims shared between parties.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

This payload is Base64Url encoded to form the second part of the JWT.

##### 3.2.1.3 Signature

**The signature ensures the integrity and authenticity of the token. It verifies that the token has not been altered and confirms the identity of the issuer.**

To create the signature part, the encoded header, encoded payload, a secret, and the algorithm specified in the header are combined and signed.

```scss
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.

##### 3.2.1.4 Putting It All Together

A JWT is formed by concatenating the Base64Url encoded header, payload, and signature, separated by dots (.).

```bash
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

#### 3.2.2 Key Features

- **Compact and Self-Contained:** JWTs contain all necessary information within the token itself, reducing the need for server-side sessions.
- **Signed Tokens:** JWTs are signed using a secret or a public/private key pair, ensuring that the token has not been tampered with.
- **Expiration:** JWTs can include an expiration time (exp), making them suitable for short-lived access tokens.

```js
import jwt from "jsonwebtoken";

// Generating a token
const token = jwt.sign({ userId: user.id }, "secret_key", { expiresIn: "1h" });

// Verifying a token
try {
  const decoded = jwt.verify(token, "secret_key");
  console.log(decoded);
} catch (err) {
  console.error("Invalid token");
}
```

> [!TIP]  
> JWT official site and playground: https://jwt.io/
