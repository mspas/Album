import React from "react";
import { Route, BrowserRouter, Redirect, Switch } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import Album from "./components/Album";
import Contact from "./components/Contact";

import "./App.sass";

function App() {
  return (
    <div className="App">
      <main>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/album" component={Album} />
            <Route path="/admin" component={AdminPanel} />
            <Route path="/contact" component={Contact} />
            <Route render={() => <Redirect to="/album" />} />
          </Switch>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
