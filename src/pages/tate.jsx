import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth'


function Profile() {
  const [user, setUser] = useState('')
  const auth = getAuth()
  useEffect(() => {
    setUser(auth.currentUser.displayName)
  }, [user])
  return (
    <>
   <h1>Hi {user} </h1>
    </>
  )
}

export default Profile
