import {Switch, Route, Redirect} from 'react-router-dom'
import './App.css'

import Login from './components/Login'
import Register from './components/Register' 
import RegistrationSuccess from './components/RegistrationSuccess'

import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'

import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'


import Saved from './components/Saved'

import Applied from './components/Applied'


const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/register" component={Register} />
    <Route exact path='/register-success' component={RegistrationSuccess} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <ProtectedRoute exact path="/saved-jobs" component={Saved} />
    <ProtectedRoute exact path="/applied" component={Applied} />
    <Route path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />

  </Switch>
)

export default App
