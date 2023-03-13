import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter
} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [totalLoaded, setTotalLoaded ] = useState(null)

    const [totalCategories, setTotalCategories] = useState(null)
    const params = useParams()

    useEffect(() => {
        const fetchListings = async () => {
            try {
                  // Get Total
               // get reference           
               const listingsRef1 = collection(db, 'listings')

               // create a query
               const q1 = query(
                listingsRef1, 
                where('type', '==', params.categoryName),
                orderBy('timestamp','desc')
                )

                // execute query
                const querySnap1 = await getDocs(q1)
             
                const categoriesCount = querySnap1.docs.length;

                setTotalCategories(categoriesCount)
                // Get reference
               const listingsRef = collection(db, 'listings')

               // create a query
               
                let limitFirstLoad = 4;        
               const q = query(
                listingsRef, 
                where('type', '==', params.categoryName), 
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
    }, [params.categoryName])

    // pagination / load more
    const onFetchMoreListings = async () => {
        try {
            // Get reference
           const listingsRef = collection(db, 'listings')

           // create a query

            const addListingsNumber = 3

           const q = query(
            listingsRef, 
            where('type', '==', params.categoryName), 
            orderBy('timestamp','desc'),
            startAfter(lastFetchedListing),
            limit(addListingsNumber)
            )

             if(totalLoaded + addListingsNumber > totalCategories)  {
            setTotalLoaded( totalCategories )

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
   <div className="category">
    <header>
        <p className="pageHeader">
            {params.categoryName === 'rent' ? 'Places for rent':'Places for sale'}
            ({totalLoaded }/{totalCategories})
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
        <br />
        {totalCategories !== totalLoaded && 
            lastFetchedListing && (
            <p 
            className="loadMore"
            onClick={onFetchMoreListings}>
            Load More
            </p>
        )}
       
        </>
    ) : (
        <p>no listings for {params.categoryName}</p>
        )}
   </div>
  )
}

export default Category
