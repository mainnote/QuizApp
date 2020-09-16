import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import Menu from './features/menu';
import HomePage from './features/home';
import QuizPage from './features/quiz';
import ResultsPage from './features/results';
import Footer from './features/footer';
import ContentPage from './features/content';

function App() {
  return (
    <Router>
      <div className="page-top">
        <Menu />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/quiz">
            <QuizPage />
          </Route>
          <Route path="/results">
            <ResultsPage />
          </Route>
          <Route path="/content">
            <ContentPage />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;