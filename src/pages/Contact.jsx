import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'


function Contact() {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()
    const urlValidName = searchParams.get('listingName')
    urlValidName.replace("&","%26")
   
    useEffect(() => {
        
        const getLandlord = async () => {

            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setLandlord(docSnap.data())
              } else {
                toast.error('Could not get landlord data')
              }
        }

        getLandlord()
    },[params.landlordId])

    const onChange = (e) => setMessage((e.target.value).replace('&','%26'))
    
    
  return (
    <div className="pageContainer">
        <header>
            <p className="pageHeader">Contact Landlord</p>
        </header>
        {landlord !== null && (
            <main>
                <div className="contactLandlord">
                    <p className="landlordName"> 
                        Contact {landlord.name}
                    </p>
                </div>    
                <form className="messageForm">
                    <div className="messageDiv">
                        <label htmlFor="message" className="messageLabel">Message</label>
                        <textarea 
                        className='textarea'
                        name="message" 
                        id="message"
                        value={message.replace('&','%26')}
                        onChange={onChange}
                        ></textarea>
                    </div>

                    <a href={`mailto:${landlord.email}?Subject=${urlValidName}&Body=${message.replace('&','%26')}`}>'
                        <button type="button" className="primaryButton">
                        Send Message
                        </button>
                    </a>
                </form>
                
            </main>
        )}
    </div>
  )
}

export default Contact
