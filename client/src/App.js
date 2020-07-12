import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import "./App.sass";
import AdminPanel from "./components/AdminPanel";
import Album from "./components/Album";
import Contact from "./components/Contact";
import SignIn from "./components/SignIn";

function App() {
  return (
    <div className="App">
      <main>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/album" component={Album} />
            <Route path="/login" component={SignIn} />
            <Route path="/admin" component={AdminPanel} />
            <Route path="/contact" component={Contact} />
            <Route render={() => <Redirect to="/album" />} />
          </Switch>
        </BrowserRouter>
      </main>
      <footer>MSpas @2020</footer>
    </div>
  );
}

export default App;
