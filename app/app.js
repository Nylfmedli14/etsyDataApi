const searchURL = 'https://openapi.etsy.com/v2/listings/active.js';

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
  console.log(result)
  // let resultURL = `https://www.etsy.com/${}`

  // if image is singular, then use the medium img url

  // else if images are plural or duplicates, then use the first medium img url
    //use .length or 0 for the first array in object
    return `
      <div>
        <a class="img-results" href="${result.url}"><img alt="${result.title}" src="${result.Images[0].url_170x135}"></a>
        <a class="img-title" href="${result.url}">${result.title}</a>
      </div>`

    //     // <a class="js-result-name" href="${}" target="_blank">${}</a>
    // `
};

function displaySearchData(data) {
  // console.log()
  let results = data.results.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
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

$(watchSubmit);
