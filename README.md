# SUMMATIVE ASSIGNMENT

# Secure Password Generator

A simple, browser-based application that generates a secure 12-character password based on user inputs. The application ensures that each generated password contains at least two uppercase letters, two symbols, and two distinct numbers. It also verifies the password against the Have I Been Pwned (HIBP) API to ensure it hasn’t been compromised in any known data breaches.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [APIs Used](#apis-used)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **Customizable Input:**  
  Enter three words (each in a separate field), symbols, and numbers to create a personalized character pool.
  
- **Password Constraints:**  
  Generates a password that is exactly 12 characters long and guarantees at least:
  - 2 uppercase letters
  - 2 symbols
  - 2 distinct digits

- **Security Check:**  
  Uses the HIBP API to verify that the generated password has not been exposed in data breaches.

- **Responsive Design:**  
  The application is responsive and works across different device sizes.

## Demo

You can view a live demo by opening the `index.html` file in your web browser or deploying it on any static hosting service (e.g., GitHub Pages).

## Installation

To run the application locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/secure-password-generator.git
   cd secure-password-generator

## Usage 
1. Enter Your Inputs:

Words: Enter three words (each in its own input field). These will contribute both lowercase and uppercase characters to the password.

Symbols: Provide a set of symbols.

Numbers: Provide a set of numbers.

2. Generate Password:

Click the "Generate Password" button.

The application will generate a 12-character password that meets the security constraints.

The generated password is displayed in a dedicated text area.

The application then hashes the password and checks it against the HIBP API. The security status is displayed in a separate text area.

## APIs Used
- Have I Been Pwned (HIBP) API
The application uses the Have I Been Pwned API to verify if the generated password has been compromised in any known data breaches. Specifically, it utilizes the Pwned Passwords API which implements a "k-anonymity" model:

- How It Works:

The password is hashed using the SHA-1 algorithm.

Only the first 5 characters of the hash are sent to the API.

The API returns a list of suffixes for hashes that share that prefix.

The application then checks if the remainder of the hash is present in the response.

Documentation:
For more details on the API and its usage, please refer to the official documentation.
