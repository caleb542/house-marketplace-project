function PaginationText({totalLoaded, totalOffers, totalCategories}) {
  return (
    <div>
        <p className="paginationText" >
            Showing {totalLoaded } of {totalOffers}
        </p>
    </div>
  )
}

export default PaginationText
