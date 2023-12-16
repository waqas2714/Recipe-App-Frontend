import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/admin.css'
import { backendUrl } from '../utils/url';
import User from '../components/User';

const Admin = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async ()=>{
    try {
      const {data} = await axios.get(`${backendUrl}/admin/getAllUsers`);
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllUsers();
  },[])

  return (
    <div className='admin-container'>
      {
        users.length > 0 ?
         users.map((user)=>{
          if (user !== null) {
            return <User username={user.username} userId={user._id} />
          }
         })
         : <h3>No Users</h3>
      }
    </div>
  )
}

export default Admin