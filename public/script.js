const API_URL = 'https://fake-crypto-coin.vercel.app/api';

async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    alert('Registration successful! Please log in.');
  } else {
    const error = await response.text();
    document.getElementById('register-error').innerText = error;
    document.getElementById('register-error').style.display = 'block';
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    alert('Login successful! Your token: ' + data.token);
  } else {
    const error = await response.text();
    document.getElementById('login-error').innerText = error;
    document.getElementById('login-error').style.display = 'block';
  }
}