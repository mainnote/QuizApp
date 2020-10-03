import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import { Store as QuizStore } from './stores/quizStore';
import { Store as PostStore } from './stores/postStore';
import Menu from './features/menu';
import HomePage from './features/home';
import QuizPage from './features/quiz';
import ResultsPage from './features/results';
import Footer from './features/footer';
import ContentPage from './features/content';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

function App() {
  return (
    <QuizStore>
      <PostStore>
        <Router>
          <div className="page-top">
            <Menu />
            <div className="main">
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route path="/quiz/:quiz_id?">
                  <QuizPage />
                </Route>
                <Route path="/results">
                  <ResultsPage />
                </Route>
                <Route path="/content/:post_id?">
                  <ContentPage contentKey="5f6d23734026e33aa8cbe67c" isPost={ true } />
                </Route>
                <Route path="/privacy">
                  <ContentPage contentKey="privacy" isPost={ false } />
                </Route>
                <Route path="/terms">
                  <ContentPage contentKey="terms" isPost={ false } />
                </Route>
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </PostStore>
    </QuizStore>
  );
}

export default App;