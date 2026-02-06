import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Toaster } from '@/utils/toaster'
import Home from '@/pages/Home/Home'
import Footer from '../Footer/Footer'
import AuthPage from '../../../pages/AuthPage/AuthPage'
import { Outlet } from 'react-router-dom'
import StudentNavbar from '../Navbar/StudentNavbar'
const AppLayout = () => {
  return (
    <>
    <div className="w-dvw h-fit ">
        <Navbar/>
        <Outlet/>
        <Footer/>
        </div>
    </>
  )
}

export default AppLayout;