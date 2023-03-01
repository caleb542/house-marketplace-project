import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import OAuth from '../components/OAuth'
import {setDoc, doc, serverTimestamp } from 'firebase/firestore'
import {db} from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name:'',
    email:'',
    password:''
  })
    const {name, email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value
    }))

  }

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword( auth, email, password) 

      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}

      delete formDataCopy.password

      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')

    } catch (error) {
      console.log(error)
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader"> 
          Sign Up
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" name="" id="name" className="nameInput" placeholder='Name' />
        <input onChange={onChange} type="email" name="" id="email" className="emailInput" placeholder='Email' />
        <div className="passwordInputDiv"> 
          <input  onChange={onChange} type={showPassword ? 'text':'password'} name="" id="password" value={password} className="passwordInput" placeholder='Password' />
          <img src={visibilityIcon} className='showPassword' alt="show password" onClick={() => setShowPassword((prevState) => !prevState)} />
        </div>
        <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>
        <div className="signUpBar">
        <p className='signUpText'>Sign Up</p>
        <button className="signUpButton">
          <ArrowRightIcon fill="#fff" width='34px' height='34px' />
        </button>
        </div>
      </form>

     <OAuth />

      <Link to="/sign-in" className='registerLink'>Sign In Instead</Link>


    </div>
    </>
  )
}

export default SignUp
