import {useState} from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from '../components/OAuth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email:'',
    password:''
  })
    const {email, password} = formData

    const navigate = useNavigate()

    const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState, 
      [e.target.id]: e.target.value
    }))

  }
  const onSubmit= async (e)=> {
    e.preventDefault()

  try {
    const auth = getAuth()
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    if(userCredential.user){
      navigate('/')
    }

  }  catch(error) {
     toast.error('Bad User Credentials!') 
  }

  }
  return (
    
    <div className="pageContainer">
      <header>
        <p className="pageHeader"> 
          Sign In
        </p>
      </header>

      <form onSubmit={onSubmit}>
        <input onChange={onChange} type="email" name="" id="email" className="emailInput" placeholder='Email' />
        <div className="passwordInputDiv">
           <input  onChange={onChange} type={showPassword ? 'text':'password'} name="" id="password" value={password} className="passwordInput" placeholder='Password' />
           <img src={visibilityIcon} className='showPassword' alt="show password" onClick={() => setShowPassword((prevState) => !prevState)} />
        </div>
        <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>
        <div className="signInBar">
        <p className='signInText'>Sign In</p>
        <button className="signInButton">
          <ArrowRightIcon fill="#fff" width='34px' height='34px' />
        </button>
        </div>
      </form>

      <OAuth />

      <Link to="/sign-up" className='registerLink'>Sign Up Instead</Link>


    </div>
    
  )
}

export default SignIn
