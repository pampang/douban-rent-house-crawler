// const HCCrawler = require('headless-chrome-crawler')
// const helper = require('./helper')

// ;(async () => {
//   const listCrawler = await HCCrawler.launch({
//     // headless: false, slowMo: 10,
//     evaluatePage: () => {
//       // title: $('title').text(),
//       // urls: $('.article .topics tr a').attr('href'),
//       contentUrls = []
//       $('.article .topics tr').each(function (index, element) {
//         const $a = $(this).find('a')
//         const href = $a.attr('href')
//         contentUrls.push(href)
//       })
//       return contentUrls
//     },
//     onSuccess: result => {
//       console.log(`Got ${result.contentUrls} for ${result.options.url}.`);
//     },
//   })

//   const urls = helper.generateListUrls().map(url => ({
//     url,
//   }))
//   await listCrawler.queue(urls.slice(0, 2))
//   await listCrawler.onIdle();
//   await listCrawler.close();
// })();

const HCCrawler = require('headless-chrome-crawler');

(async () => {
  const crawler = await HCCrawler.launch({
    // 主要逻辑做在这里
    evaluatePage: () => {
      // title: $('title').text(),
      // urls: $('.article .topics tr a').attr('href'),
      contentUrls = []
      $('.article .topics tr').each(function (index, element) {
        const $a = $(this).find('a')
        const href = $a.attr('href')
        contentUrls.push(href)
      })
      return {
        contentUrls,
      }
    },
    // onSuccess: result => {
    //   console.log(`Got ${result.result.title} for ${result.options.url}.`);
    // },
  });
  // await crawler.queue('https://baidu.com/'); // Queue a request
  await crawler.queue({ url: 'https://www.douban.com/group/search?cat=1013&group=90742&sort=time&q=%E5%B9%BF%E5%B7%9E%E5%A1%94' }); // Queue multiple requests in different styles
  await crawler.onIdle();
  await crawler.close();
})();
