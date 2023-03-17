import {useEffect, useState} from 'react'
import { collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import PaginationText from '../components/PaginationText'
import {motion, AnimatePresence} from 'framer-motion'

function Offers() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const [totalLoaded, setTotalLoaded ] = useState(null)

    const [totalOffers, setTotalOffers] = useState(null)

    useEffect(() => {
        const fetchListings = async () => {
            try {
            // Get Total
               // get reference           
               const listingsRef1 = collection(db, 'listings')

               // create a query
               const q1 = query(
                listingsRef1, 
                where('offer', '==', true), 
                orderBy('timestamp','desc')
                )

                // execute query
                const querySnap1 = await getDocs(q1)
             
                const offersCount = querySnap1.docs.length;

                setTotalOffers(offersCount)

            //Get limited results
            
                // Get reference
               const listingsRef = collection(db, 'listings')

               // create a query
               let limitFirstLoad = 4;

               const q = query(
                listingsRef, 
                where('offer', '==', true), 
                orderBy('timestamp','desc'),
                limit(limitFirstLoad)
                )

                setTotalLoaded(limitFirstLoad)
               
                // execute query
                const querySnap = await getDocs(q)
      
                const lastVisible = querySnap.docs[querySnap.docs.length -1]
                setLastFetchedListing(lastVisible)

                const listings = []

                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })
               
                setListings(listings)
                setLoading(false)

            } catch (error){
                toast.error("Could not fetch the listings")
            }   
        }

        fetchListings()
    },[])
     // pagination / load more
     const onFetchMoreListings = async () => {
        try {
            // Get reference
           const listingsRef = collection(db, 'listings')

           // create a query
            const addListingsNumber = 3

           const q = query(
            listingsRef, 
            where('offer', '==', true), 
            orderBy('timestamp','desc'),
            startAfter(lastFetchedListing),
            limit(addListingsNumber)
            )
            
            function setDelay(){
                if(totalLoaded + addListingsNumber > totalOffers)  {
                    setTotalLoaded( totalOffers )
        
                    } else {
                        setTotalLoaded( totalLoaded + addListingsNumber)
                    }
            }
            setTimeout( setDelay, 1800)

          
            
            // execute query
            const querySnap = await getDocs(q)
            

            const lastVisible = querySnap.docs[querySnap.docs.length -1]
            setLastFetchedListing(lastVisible)

            const listings = []
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
           
            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)

        } catch (error){
            toast.error("Could not fetch the listings")
        }   
    }
  return (
   <div className="offers">
    <header>
        <p className="pageHeader">
            Offers
        </p>
    </header>
    {loading ? (
     <Spinner/>
    ): listings && listings.length > 0 ? (
        <>
        <main>
            <ul className="categoryListings">
            
                {listings.map((listing, index) => (
                    <li  key={index} className="categoryListing"  style={{ animation: `card 1s ease-in-out forwards ${index * 0.1}s`}} >
                        <ListingItem 
                       
                            listing={listing.data}
                            id={listing.id }
                           
                        
                        />
                    </li>
                ))}
           
            </ul>
        </main>
        <br />
        <br />
        <div className="pagination">
            {totalOffers !== totalLoaded && lastFetchedListing && (
                <button 
                className="loadMore"
                onClick={onFetchMoreListings}>
                Load More
                </button>
            )}
            <PaginationText
                totalLoaded={totalLoaded}
                totalOffers={totalOffers}
            />

          
        </div>
       
        </>
    ) : (
        <p>There are no current offers</p>
        )}
   </div>
  )
}

export default Offers
