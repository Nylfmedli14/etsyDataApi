const searchURL = 'https://openapi.etsy.com/v2/listings/active.js';
const cachedListings = {}; 

function searchListings(searchTerm, callback) {
  	 const request = {
        api_key: 'vz1sihltqyuz61jmee9p1qjf',
        keywords: searchTerm,
        limit: 25,
        includes: 'Images,Shop',
        callback: 'displaySearchData'
  	}
    let etsyURL = searchURL + `?includes=Images,Shop&keywords=${searchTerm}&limit=10&api_key=vz1sihltqyuz61jmee9p1qjf`; 

    $.ajax( {
      url: etsyURL,
      dataType: 'jsonp',
      success: callback
    }
    )

};

function renderResult(result) {
  // console.log(result.Images[0].url_170x135)
  // console.log(result)
  // let resultURL = `https://www.etsy.com/${}`

  // if image is singular, then use the medium img url

  // else if images are plural or duplicates, then use the first medium img url
    //use .length or 0 for the first array in object
    cachedListings[result.listing_id] = result 

    return `
      <div>
        <a class="img-results" href="${result.url}"><img alt="${result.title}" src="${result.Images[0].url_170x135}"></a>
        <a class="img-title" href="${result.url}">${result.title}</a>
        <button data-listingid="${result.listing_id}" class="compare-button" role="link" type="button">Compare</button>
      </div>`
};

// maybe renderComparison can be added within renderResult

function renderComparison(clickedId) {
  /*  when button is clicked  */

  let listing = cachedListings[clickedId];

  return `
    <div>
      <a href="${listing.url}">${listing.title}</a>
      <h2>${listing.price}</h2>
    </div>
  `


  //  populate div with image, title and price //

  // price => ${result.price} //
}

function displaySearchData(data) {
  // console.log()
  let results = data.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  console.log(cachedListings);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    // console.log($(event.currentTarget));
    const searchTarget = $(event.currentTarget).find('.js-query');
    const request = searchTarget.val();
    // clear out the input
    searchTarget.val("");
    searchListings(request, displaySearchData);
  });
}

$(`#js-search-results`).delegate(".compare-button", "click", function(event) {
  // console.log(event)
  const clickButton = $(this)
  const clickedId = clickButton.data(`listingid`)

  $(`.compare`).html(renderComparison(clickedId)) 

});
$(watchSubmit);
