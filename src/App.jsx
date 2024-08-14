// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddProducts from './Pages/AddProducts.jsx'; 
import ManageEvents from './Pages/ManageEvents.jsx';
import Registered from './Pages/Registered.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> Your home page */}
        <Route path="/add-products" element={<AddProducts />} /> 
        <Route path="/manageEvents" element={<ManageEvents />} />
        <Route path="/registered/:event_id" element={<Registered />} />{/* New route */}
      </Routes>
    </Router>
  );
};

export default App;
