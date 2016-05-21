// simple instagram api wrapper
// we are using instagram-node for authentication
// great lib, but doesn't have support for old clients that are not limited by sandbox mode
// creating this wrapper to take advantage for better non sandboxed data for testing

// lib
const _ = require('lodash');
const request = require('request-promise');
const log = require('lib/util/logger');
const BASE_URL = 'https://api.instagram.com/v1';

// an instagram request that supports paging
const InstagramRequest = module.exports = class InstagramRequest {

  static recentByTagUntil(tag, until, opts) {
    return new Promise((resolve, reject) => {
      const req = InstagramRequest.recentByTag(tag, opts);

      // start paging instagram results
      let all = [];
      req.next().then(checkMore).catch(reject);

      function checkMore(res) {
        // no pics on instagram? just continue
        if(res.data.length === 0) {
          return resolve(all);
        }

        // otherwise update request state
        all = all.concat(res.data);
        const media = _.last(res.data);
        const lastUpdated = getLastUpdated(media);
        if(req.hasMore && lastUpdated >= until) {
          req.next().then(checkMore).catch(reject);
        } else {
          resolve(all);
        }
      }
    });
  }

  static recentByTag(tag, opts) {
    const url = `${BASE_URL}/tags/${tag}/media/recent`;
    return new InstagramRequest(url, opts);
  }

  constructor(url, opts) {
    this.paged = 0;
    this.nextUrl = null;

    this.url = url;
    this.count = opts.count;
    this.apiKey = opts.apiKey;
  }

  next() {
    log('instagram request:', this.nextUrl || this.url);
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
      log('instagram request: nothing to page');
      return Promise.resolve({ data: [] });
    }
  }

  get hasMore() {
    return this.paged === 0 || !!this.nextUrl;
  }

  _onPaged(res) {
    this.nextUrl = res.pagination.next_url;
    this.paged++;
    return parse(res);
  }
};

// helper - parse ig media
function parse(res) {
  res.data = res.data.map(d => {
    d.created_time = new Date(d.created_time * 1000);
    if(d.caption) {
      d.caption.created_time = new Date(d.caption.created_time * 1000);
    }
    if(d.comments.count > 0) {
      d.comments.data = d.comments.data.map(c => {
        c.created_time = new Date(c.created_time * 1000);
        return c;
      });
    }
    return d;
  });
  return res;
}

// helper - get last updated time of media
// this is only an approximation since not all comments are returned
function getLastUpdated(media) {
  const times = [ media.created_time, media.caption.created_time ]
    .concat(media.comments.data.map(c => c.created_time));
  return _.max(times);
}

// debug code
// const config = require('config');
// InstagramRequest.recentByTagUntil('werwerwer', new Date('2016-01-01 00:00'), {
//   count: 10,
//   apiKey: config.instagram.clientid2
// }).then(media => {
//   console.log(media.length);
// });
