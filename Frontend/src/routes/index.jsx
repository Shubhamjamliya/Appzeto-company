import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Rewards from '../pages/Rewards';
import Account from '../pages/Account';
import Native from '../pages/Native';
import ACService from '../pages/ACService';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import SalonForWomen from '../pages/SalonForWomen';
import MassageForMen from '../pages/MassageForMen';
import BathroomKitchenCleaning from '../pages/BathroomKitchenCleaning';
import SofaCarpetCleaning from '../pages/SofaCarpetCleaning';
import Electrician from '../pages/Electrician';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/account" element={<Account />} />
      <Route path="/native" element={<Native />} />
      <Route path="/ac-service" element={<ACService />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/salon-for-women" element={<SalonForWomen />} />
      <Route path="/massage-for-men" element={<MassageForMen />} />
      <Route path="/bathroom-kitchen-cleaning" element={<BathroomKitchenCleaning />} />
      <Route path="/sofa-carpet-cleaning" element={<SofaCarpetCleaning />} />
      <Route path="/electrician" element={<Electrician />} />
    </Routes>
  );
};

export default AppRoutes;

