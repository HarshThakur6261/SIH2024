import React from 'react'
import {  useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
 
  return (
    <div>
      <button onClick={() =>{
        navigate("/AddScheme")
      }}>Add Scheme</button>


      <button onClick={() =>{
        navigate("/AddLocation")
      }}
      >Add Location</button>


      <button onClick={() =>{
        navigate("/signup")
      }}> Signup</button>

<button onClick={() =>{
        navigate("/OpenAccount")
      }}> Open Account</button>
    </div>
  )
}

export default Home
