import React from 'react'
import { useNavigate } from 'react-router-dom'

const User = ({username, userId}) => {

  const navigate = useNavigate();
  return (
    <div className="user-card" onClick={()=>navigate(`/admin/${userId}`)}>{username}</div>
  )
}

export default User