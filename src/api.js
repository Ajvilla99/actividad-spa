import { auth } from "./auth";
const api_url = "http://localhost:3000";


export const fetchData = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

export const onLogin = async (username, password) => {
  const usuarios = await fetchData(`${api_url}/users`);
  const authenticated = usuarios.find(
    (user) =>
      (user.email === username || user.username === username) &&
      user.password === password
  );

  if (authenticated) {
    const token = Math.floor(10000 + Math.random() * 90000);
    auth.login(token, authenticated);
    return true; // ✔️ login exitoso
  }

  return false; // ❌ login fallido
};


export const createAccount = async () => {

}