import decode from "jwt-decode";

export default class AuthService {
  constructor() {
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.getEmail = this.getEmail.bind(this);
  }

  async login(password) {
    const res = await this.fetch(`/api/admin/login`, {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });
    this.setToken(res.token);
    return Promise.resolve(res);
  }

  loggedIn() {
    const token = this.getToken();
    //return !!token && !this.isTokenExpired(token);
    let check = token ? true : false;
    return check;
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  setToken(token) {
    if (token !== null) localStorage.setItem("token", token);
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getEmail(token) {
    try {
      const decoded = decode(token);
      return decoded.email;
    } catch (err) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem("token");
  }

  fetch(url, options) {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (this.loggedIn()) {
      headers["X-Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    }).then((response) => response.json());
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      alert("Error database fetch data");
      throw error;
    }
  }
}
