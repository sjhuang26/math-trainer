import $ from 'jquery';

function fixURI(uri) {
  // get rid of the file:// that's in the front
  uri = uri.substr(7);
  
  // relative URIs have an additional /C: that needs to be replaced with the AoPS domain
  if (uri.startsWith("/C:")) uri = "artofproblemsolving.com" + uri.substr(3);
  
  // add the protocol back
  uri = "https://" + uri;
  
  return uri;
}

function getEditPageURI(page) {
  return getPageURI(page) + "&action=edit";
}

function getPageURI(page) {
  return "https://artofproblemsolving.com/wiki/index.php?title=" + page;
}

function load(a) { 
  return Array.isArray(a) ? load_pages(a) : load_page(a); 
}

function load_page(page) {
  return new Promise((resolve, reject) => {
    // ajax request
    $.ajax({
      url: "https://artofproblemsolving.com/wiki/api.php",
      jsonp: "callback",
      dataType: "jsonp",
      data: {
        action: "parse",
        page: page,
        format: "json",

        // automatically apply redirects in Wiki pages (common with AMC questions)
        redirects: null
      },
      error: (requestObject) => {
        reject({
          type: errorType.NETWORK_ERROR,
          requestObject: requestObject
        });
      },
      success: (response) => {
        if (response.error) {
          if (response.error.code === "missingtitle") {
            reject({
              type: errorType.MISSING_PAGE,
              page: page});
          } else {
            reject({
              type: errorType.OTHER,
              response: response});
          }
        } else {
          var html = $.parseHTML(response["parse"]["text"]["*"]);
            
          // fix up all URIs
          $(html).find("[src]").each((index, value) => {
            value.src = fixURI(value.src);
          });
          
          $(html).find("[href]").each((index, value) => {
            value.href = fixURI(value.href);
          });
          
          resolve(html);
        }
      }
    });
  });
}

function load_pages(pages) {
  var promises = [];
  pages.forEach(value => {
    promises.push(load(value));
  });
  
  return new Promise((resolve, reject) => {
    Promise.all(promises).then(values => {
      var result = {};

      values.forEach((value, index) => {
        result[pages[index]] = value;
      });

      resolve(result);
    });
  });
}

var errorType = {
  MISSING_PAGE: "MISSING_PAGE",
  OTHER: "OTHER",
  NETWORK_ERROR: "NETWORK_ERROR"
};

export default {
  errorType: errorType,
  getEditPageURI: getEditPageURI,
  getPageURI: getPageURI,
  load: load
};