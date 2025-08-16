export async function login(email, password) {
  const res = await fetch("https://127.0.0.1:8000/users/auth/login/", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}


export async function logout() {
  const res = await fetch("https://127.0.0.1:8000/users/auth/logout/", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}


// to get some request with authorization
// function getCookie(name) {
//   return document.cookie.split("; ").reduce((r, c) => {
//     const [k, v] = c.split("=");
//     return k === name ? decodeURIComponent(v) : r;
//   }, "");
// }

// example POST with CSRF
// await fetch("http://127.0.0.1:8000/some-protected-endpoint/", {
//   method: "POST",
//   credentials: "include",
//   headers: {
//     "Content-Type": "application/json",
//     "X-CSRFToken": getCookie("csrftoken"),
//   },
//   body: JSON.stringify({ ... }),
// });