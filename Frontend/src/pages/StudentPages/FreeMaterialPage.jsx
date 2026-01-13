import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';
import Navbar from '../../components/layout/Navbar/Navbar';
import Footer from '../../components/layout/Footer/Footer';
import FreeMaterial from './FreeMaterial';
const FreeMaterialPage = ({children}) => {
    const {user,roleRoute} = useAuth();
    
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  )
}

export default FreeMaterialPage