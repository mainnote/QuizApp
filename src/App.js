import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import { Store as QuizStore } from './stores/quizStore';
import Menu from './features/menu';
import HomePage from './features/home';
import QuizPage from './features/quiz';
import ResultsPage from './features/results';
import Footer from './features/footer';
import ContentPage from './features/content';

function App() {
  return (
    <QuizStore>
      <Router>
        <div className="page-top">
          <Menu />
          <div className="main">
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
          </div>
          <Footer />
        </div>
      </Router>
    </QuizStore>
  );
}

export default App;