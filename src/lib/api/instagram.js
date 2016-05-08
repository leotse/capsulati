// simple instagram api wrapper
// we are using instagram-node for authentication
// great lib, but doesn't have support for old clients that are not limited by sandbox mode
// creating this wrapper to take advantage for better non sandboxed data for testing

// lib
const request = require('request-promise');
const log = require('lib/util/logger');

const BASE_URL = 'https://api.instagram.com/v1';

// an instagram request that supports paging
class IGReq {

  static recentByTag(tag, opts) {
    const url = `${BASE_URL}/tags/${tag}/media/recent`;
    return new IGReq(url, opts);
  }

  constructor(url, opts) {
    this.paged = 0;
    this.nextUrl = null;
    this.url = url;
    this.count = opts.count;
    this.apiKey = opts.apiKey;
  }

  next() {
    log('igreq:', this.url);
    if(this.paged === 0) {
      const query = {
        client_id: this.apiKey,
        count: this.count || 50
      };
      return request({
        url: this.url,
        qs: query,
        json: true
      }).then(this._onPaged.bind(this));
    } else if(this.paged > 0 && this.nextUrl) {
      return request({
        url: this.nextUrl,
        json: true
      }).then(this._onPaged.bind(this));
    } else {
      log('igreq: nothing to page');
      return Promise.resolve({ data: [] });
    }
  }

  get hasMore() {
    return this.paged === 0 || !!this.nextUrl;
  }

  _onPaged(res) {
    this.nextUrl = res.pagination.next_url;
    this.paged++;
    return res;
  }
}
