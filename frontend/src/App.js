import './App.css';
import WelcomeScreen from './WelcomeScreen';
import UserList from './UserList';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<WelcomeScreen />} />
        <Route exact path='/user-list' element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
