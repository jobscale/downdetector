require('core');
const { JSDOM } = require('jsdom');

class DownDetector {
  run() {
    const urls = [{
      location: 'jp',
      url: 'https://downdetector.jp',
    }, {
      location: 'com',
      url: 'https://downdetector.com',
    }];
    return Promise.all(
      urls.map(url => this.parse(url)),
    );
  }
  parse(param) {
    return fetch(param.url)
    .then(res => res.text())
    .then(body => new JSDOM(body).window.document)
    .then(document => {
      const list = Object.values(document.querySelectorAll('.companies.thumbnails > div img'));
      list.length = 3;
      const caption = `${param.location} - ${list.map(el => el.title).join(', ')}`;
      const el = list[0];
      const body = el.title;
      const image = el.dataset.original;
      return {
        body,
        caption,
        image,
      };
    });
  }
}
module.exports = {
  DownDetector,
};
