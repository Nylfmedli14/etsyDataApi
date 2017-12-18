const searchURL = 'https://openapi.etsy.com/v2/listings/active.js';
const cachedListings = {};

function searchListings(searchTerm, callback, page) {
    const etsyURL = searchURL + `?includes=Images,Shop&keywords=${searchTerm}&limit=24&offset=${page * 25}&api_key=vz1sihltqyuz61jmee9p1qjf`;

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
          <br>
          <a class="img-results" href="${result.url}"><img class="listing-img" alt="${result.title}" src="${imageUrl}"></a>
          <br>
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
      <div class="comparison-listing">
        <div class="result-listing">
          <br>
          <a class="img-results" href="${listing.url}"><img class="listing-img" alt="${listing.title}" src="${imageUrl}"></a>
          <br>
          <a href="${listing.url}">${listing.title}</a>
          <br>
          <a href="${listing.url}">$${listing.price}</a>
          <button class="remove-button">Remove</button>
        </div>
      </div>
    `
}

function displaySearchData(data) {
  let results = data.results.map((item, index) => renderResult(item));
  $('.pages').removeClass("hidden");
  const resultsHeader = document.getElementById('results-header');
  console.log(resultsHeader);
  if (!resultsHeader) {
    $( '<h2 id="results-header">Results</h2>' ).insertBefore( ".js-search-results" );
  }
  $('.js-search-results').html(results);
  console.log(cachedListings);
}

function initialize() {
  let page = 0;
  let request;

  $('.js-search-form').submit(event => {
    event.preventDefault();
    page = 0;
    const searchTarget = $(event.currentTarget).find('.js-query');
    const compareElement = $('#compare');
    request = searchTarget.val();
    // clear out the input
    searchTarget.val("");
    compareElement.html("");
    searchListings(request, displaySearchData, page);
    pageCounter(page);
  });

  $(`#js-search-results`).delegate(".compare-button", "click", function(event) {
    const clickButton = $(this)
    const clickedId = clickButton.data(`listingid`)

    $(`#compare`).append(renderComparison(clickedId))

  });

  $(`#compare`).delegate(".remove-button", "click", function(event) {
    const clickButton = $(this)
    const comparisonListing = clickButton.closest(".comparison-listing")

    comparisonListing.remove();
  })

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
  $(`#pages-display`).text(page + 1)
  console.log(page)
}
