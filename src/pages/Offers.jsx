import {useEffect, useState} from 'react'
import { collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

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
           if(totalLoaded + addListingsNumber > totalOffers)  {
            setTotalLoaded( totalOffers )

        } else {
            setTotalLoaded( totalLoaded + addListingsNumber)
        }
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
            Offers ({totalLoaded }/{totalOffers})
        </p>
    </header>
    {loading ? (
     <Spinner/>
    ): listings && listings.length > 0 ? (
        <>
        <main>
            <ul className="categoryListings">
            {listings.map((listing) => (
                <ListingItem 
                    listing={listing.data}
                    id={listing.id }
                    key={listing.id}
                   
                />
                    
            ))}
            </ul>
        </main>
        <br />
        <br />
        {totalOffers !== totalLoaded && lastFetchedListing && (
            <p 
            className="loadMore"
            onClick={onFetchMoreListings}>
            Load More
            </p>
        )}
        </>
    ) : (
        <p>There are no current offers</p>
        )}
   </div>
  )
}

export default Offers
