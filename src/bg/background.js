'use strict';

import extractQuery from './extractQuery.js';

chrome.tabs.onUpdated.addListener(onTabsUpdated);

/////
function onTabsUpdated(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    let query = extractQuery(tab.url);
    query = decodeURIComponent(query);

    queryBookmark(query).then(function(bookmarks) {

      return new Promise(function(ok) {

        if (bookmarks.length) {
          chrome.tabs.sendRequest(tabId, {
            event: 'pleasurazy-bookmark-native-searcher:queryBookmarksEnded',
            data: bookmarks,
          });
        }

        ok(bookmarks);
      });
    });
  }
}

function queryBookmark(query) {

  return new Promise(function(ok) {

    chrome.bookmarks.search(`${query}`, function(bookmarks) {
      ok(bookmarks || []);
    });
  });
}
