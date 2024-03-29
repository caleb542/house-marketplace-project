import { useState, useEffect } from 'react'
import {useNavigate, Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAuth, updateProfile } from 'firebase/auth'
import {db} from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from 'firebase/firestore'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false) 
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  const navigate = useNavigate()

  useEffect(()=>{
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
    
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp','desc')
      )

      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }
    
    fetchUserListings()
  }, [auth.currentUser.uid])


  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async() => {
    try{
      if(auth.currentUser.displayName !== name){
        // update display name
        await updateProfile(auth.currentUser, {
          displayName: name,
          email:email
        })
        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
          email
        })
        toast.success(`User details updated: Name: ${name} Email:${email}`)
      }

    } catch( error ){
      console.log(error)
      toast.error('Could not update profile details')
    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  
  const onDelete = async (listingId) => {

    const listing = listings.find((item) => item.id === listingId)
    const listingImages = listing.data.imgUrls

    if(window.confirm('Are  you sure you want to delete?')){

      // Delete the Images from Storage
      const storage = getStorage()

      listingImages.forEach(image => {
        const desertRef = ref(storage, image)

        deleteObject(desertRef).then(() => {
          toast.success('Image removed from storage')
        }
        ).catch((error) => {
          console.log(error)
          toast.error('Image could not be deleted')
        });
      })
      // Delete the listing
        await deleteDoc(doc(db, 'listings', listingId))
        const updatedListings = listings.filter((listing) => listing.id !== listingId)
          
        setListings(updatedListings)
        toast.success('Successfully Deleted')
        
    }
  }

  const onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">{formData.name}'s Profile</p>
        <button type='button' className="logOut" onClick={onLogout}>Logout</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() =>{
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
          {changeDetails ? 'done':'change'}
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input type="text" name="" id="name" className={!changeDetails ? 'profileName':'profileNameActive'}  disabled={!changeDetails} value={name} onChange={onChange} />

            <input type="text" name="" id="email" className={!changeDetails ? 'profileEmail':'profileEmailActive'}  disabled={!changeDetails} value={email} onChange={onChange} />
            
          </form>
        </div>
        <Link to='/create-listing' className='createListing'>
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />

        </Link>

        {!loading && listings?.length > 0 && (
          <>
          <p className="listingText">Your Listings ({listings?.length})</p>
          <ul className="listingsText">
          {listings.map((listing, index) => (
           <li  key={index} className="categoryListing"  style={{ animation: `card 1s ease-in-out forwards ${index * 0.1}s`}} >
            
              <ListingItem 
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onEdit={() => onEdit(listing.id)}
                  onDelete={() => onDelete(listing.id)}
                />
                </li>
              ))}
            
          </ul>
          
          </>
        )}
      </main>
    </div>
  )
}

export default Profile
