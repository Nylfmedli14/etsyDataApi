const searchURL = 'https://openapi.etsy.com/v2/listings/active.js';
const cachedListings = {};

function searchListings(searchTerm, callback, page) {
    let etsyURL = searchURL + `?includes=Images,Shop&keywords=${searchTerm}&limit=25&offset=${page * 25}&api_key=vz1sihltqyuz61jmee9p1qjf`;

    $.ajax( {
      url: etsyURL,
      dataType: 'jsonp',
      success: callback
    }
    )

}

function renderResult(result) {
    cachedListings[result.listing_id] = result
    const imageUrl = result && result.Images && result.Images[0] && result.Images[0].url_570xN

    return `
      <div class="col-4">
        <div class="result-listing">
          <a class="img-results" href="${result.url}"><img class="listing-img" alt="${result.title}" src="${imageUrl}"></a>
            <a class="img-title" href="${result.url}">${result.title}</a>
            <button data-listingid="${result.listing_id}" class="compare-button" role="link" type="button">Compare</button>
        </div>
      </div>
      `
}

function renderComparison(clickedId) {
  /*  when button is clicked  */
  let listing = cachedListings[clickedId];
  const imageUrl = listing && listing.Images && listing.Images[0] && listing.Images[0].url_570xN

  return `
    <div class="col-4">
      <div class="comparison-listing">
        <a class="img-results" href="${listing.url}"><img class="listing-img" alt="${listing.title}" src="${imageUrl}"></a>
        <a href="${listing.url}">${listing.title}</a>
        <h2>$${listing.price}</h2>
        <button class="remove-button">Remove</button>
      </div>
    </div>
    `
}

function displaySearchData(data) {
  // console.log()
  let results = data.results.map((item, index) => renderResult(item));
  $('.pages').removeClass("hidden");
  $('.js-search-results').html(results);
  console.log(cachedListings);
}

function initialize() {
  let page = 0;
  let request;

  $('.js-search-form').submit(event => {
    event.preventDefault();
    page = 0;
    // console.log($(event.currentTarget));
    const searchTarget = $(event.currentTarget).find('.js-query');
    request = searchTarget.val();
    // clear out the input
    searchTarget.val("");
    searchListings(request, displaySearchData, page);
  });

  $(`#js-search-results`).delegate(".compare-button", "click", function(event) {
    // console.log(event)
    const clickButton = $(this)
    const clickedId = clickButton.data(`listingid`)

    $(`#compare`).append(renderComparison(clickedId))

  });

  $(`#compare`).delegate(".remove-button", "click", function(event) {
    const clickButton = $(this)
    const comparisonListing = clickButton.closest(".comparison-listing")
    comparisonListing.remove();
  })
  // $(`#pages-button-prev`)
  $(`#pages-button-next`).on("click", function(event) {
    event.preventDefault();
    searchListings(request, displaySearchData, ++page);
    pageCounter(page);

  })
    $(`#pages-button-prev`).on("click", function(event) {
      event.preventDefault();
      if (page === 0) {
        return;
      }
      searchListings(request, displaySearchData, --page);
      pageCounter(page);
    })
}

$(initialize);

function pageCounter(page) {
  // next clicked
  $(`#pages-display`).text(page + 1)
  console.log(page)
}
