document.getElementById("generate").addEventListener("click", async function () {
  const word1   = document.getElementById("word1").value.trim();
  const word2   = document.getElementById("word2").value.trim();
  const word3   = document.getElementById("word3").value.trim();
  const symbols = document.getElementById("symbols").value.trim();
  const numbers = document.getElementById("numbers").value.trim();

  const passwordTextarea = document.querySelector("#password textarea");
  const statusTextarea   = document.querySelector("#status textarea");

  // Clear old results
  passwordTextarea.value = "";
  statusTextarea.value   = "";

  // Basic validation of inputs
  // makes sure that the user input required data in the fields provided
  if (!word1 || !word2 || !word3 || !symbols || !numbers) {
    statusTextarea.value = "Please fill in all fields.";
    return;
  }

  // Combine user inputs into one pool of characters.
  // 1) We include the words as typed (likely lowercase).
  // 2) We also add an uppercase version of the words to ensure uppercase letters are available.
  // 3) Then we add the user-provided symbols and numbers.
  const wordsLower = word1 + word2 + word3; 
  const wordsUpper = wordsLower.toUpperCase(); 
  const combined   = wordsLower + wordsUpper + symbols + numbers;

  // Generate a 12-character password that meets the constraints
  let password = generateRandomPasswordWithConstraints(combined, 12);
  if (!password) {
    // If no valid password was generated (maybe user input is too limited),
    // let the user know and stop.
    statusTextarea.value = "Unable to generate a valid password with the given constraints.";
    return;
  }

  // Display the generated password
  passwordTextarea.value = password;
  // Show "Checking password security..."
  statusTextarea.value = "Checking password security...";

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Check if password is compromised (via HIBP(Have I Been Pawned) range API)
  const isCompromised = await checkPasswordHIBP(hashedPassword);

  if (isCompromised) {
    statusTextarea.value = "Compromised! Generate a new password.";
  } else {
    statusTextarea.value = "Safe password!";
  }
});

/**
 * In case the password is compromised 
 * Keeps trying to generate a random password of `length` from `input` until it meets:
 * - At least 2 uppercase letters
 * - At least 2 symbols (from the user's symbol set)
 * - At least 2 distinct digits
 * - Exactly 12 characters long
 * Returns the password if successful, or null if it cannot meet the constraints.
 */
function generateRandomPasswordWithConstraints(input, length) {
  const maxAttempts = 5000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += input[Math.floor(Math.random() * input.length)];
    }
    if (meetsConstraints(pwd)) {
      return pwd;
    }
    attempt++;
  }
  // Could not generate a valid password within maxAttempts
  return null;
}

/**
 * Checks if a password has:
 *  - at least 2 uppercase letters
 *  - at least 2 symbols (assumed to be any of the user-provided symbols)
 *  - at least 2 distinct digits
 */
function meetsConstraints(password) {
  // Count uppercase letters
  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  if (uppercaseCount < 2) return false;

  // Count symbols: adjust the character class if you want to match EXACTLY
  // the symbols user typed. For simplicity, we assume typical special chars:
  // !@#$%^&*()_+~`|}{[]\:;?><,./-=
  // Or you can define a custom regex from the user's `symbols` input.
  const symbolCount = (password.match(/[!@#$%^&*()_\+\-=\[\]{};':"\\|,.<>\/?~`]/g) || []).length;
  if (symbolCount < 2) return false;

  // Count distinct digits
  const digits = password.match(/\d/g) || [];
  const distinctDigits = new Set(digits);
  if (distinctDigits.size < 2) return false;

  return true;
}

/**
 * Hash the password using SHA-1
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Checks the SHA-1 hash of the password against Have I Been Pwned (HIBP)
 */
async function checkPasswordHIBP(hash) {
  // First 5 chars of the hash
  const prefix = hash.substring(0, 5);
  // Query the Have I Been Pwned range API
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  const hashes = await response.text();
  // Check if the remainder of our hash appears in the list
  return hashes.includes(hash.substring(5).toUpperCase());
}
