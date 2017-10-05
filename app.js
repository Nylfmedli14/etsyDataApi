const searchURL = 'https://openapi.etsy.com/v2/listings';

function getDataFromApi(searchTerm, callback) {
  	 const request = {
        key: 'vz1sihltqyuz61jmee9p1qjf',
        
  	}
    $.getJSON(searchURL, request, callback); 
}

function renderResult(result) {
  console.log(result)
  // return 
  // 	$('items.snippet.thumbnails.medium.url');
  let resultURL = ;

    return `
      <div>
        <img alt="${}" src="${}">
        <a class="js-result-name" href="${resultURL}" target="_blank">${}</a>
    `
};

function displaySearchData(data) {
  console.log(data)
  const results = .map((item, index) => renderResult(item));
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
    getDataFromApi(request, displaySearchData);
  });
}

$(watchSubmit);
