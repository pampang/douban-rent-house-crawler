const HCCrawler = require('headless-chrome-crawler')
const helper = require('./helper')

async function runner() {
  const listCrawler = await HCCrawler.launch({
    onSuccess: result => {
      // console.log(`Screenshot is saved as ${PATH}${result.options.saveAs} for ${result.options.url}.`);
      console.log(result)
    },
    // preRequest: options => {
    //   if (!options.saveAs) return false; // Skip the request by returning false
    //   options.screenshot = { path: `${PATH}${options.saveAs}` };
    //   return true;
    // },
  })

  const urls = helper.generateListUrls().map(url => ({
    url,
  }))
  await listCrawler.queue(urls)
  await listCrawler.onIdle();
  await listCrawler.close();
}

runner()
