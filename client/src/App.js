import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import "./App.sass";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Home from "./components/Album/Home";
import Album from "./components/Album/Album";
import Contact from "./components/Album/Contact";
import SignIn from "./components/AdminPanel/SignIn";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <main>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Header sticky={false} />
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/album" component={Album} />
            <Route path="/login" component={SignIn} />
            <Route path="/admin" component={AdminPanel} />
            <Route path="/kontakt" component={Contact} />
            <Route render={() => <Redirect to="/home" />} />
          </Switch>
        </BrowserRouter>
      </main>
      <footer>MSpas @2020</footer>
    </div>
  );
}

export default App;
