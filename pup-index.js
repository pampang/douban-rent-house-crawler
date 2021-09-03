// 使用最原始的 puppeteer 来跑！
const puppeteer = require('puppeteer')
const HCCrawler = require('headless-chrome-crawler');
const helper = require('./helper')

function isNeedLogin(response) {
  if (!response.ok && response.url.includes('sec.douban.com')) {
    return true
  }
  return false
}

const COMMON_CRAWLER_CONFIG = {
  // 在我面前打开 chromium
  headless: false,
  //  Slows down Puppeteer operations by the specified amount of milliseconds. Useful so that you can see what is going on.
  slowMo: 1000,
  // 调出 devtools
  devtools: true,
  maxConcurrency: 1,
}

const jQueryPath = require.resolve('jquery');
async function addJQuery(page) {
  await page.addScriptTag({ path: jQueryPath });
}

// 登录就是把 cookie 存起来，每次启动的时候，再写回去就好了。
// 使用 userDataDir 来保存。
// 一个 browser，然后多个 page 来跑。

;(async () => {
  try {
    // login
    // FIXME: 登录逻辑中还有验证码，并不是我们能通过代码实现的。
    // 目前先手动登录。
    const loginCrawler = await HCCrawler.launch({
      ...COMMON_CRAWLER_CONFIG,

      url: 'https://accounts.douban.com/passport/login',

      // 自定义 chrome page 的动作
      customCrawl: async (page, crawl) => {
        const result = await crawl()
        await page.waitFor('.account-tab-account')
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        await page.evaluate(() => {
          debugger
          $('.account-tab-account').click()
          $('.account-form-input').val('fspwz@sina.com')
          $('.password').val('a1994618a')
          $('.account-form-field-submit a').click()
        })
        await page.waitFor(3000)
      },
    })

    async function login() {
      await loginCrawler.queue()
      await loginCrawler.onIdle()
      await loginCrawler.close()
    }

    // 拉取 list。然后应该分发去拉取 content 了
    const listCrawler = await HCCrawler.launch({
      ...COMMON_CRAWLER_CONFIG,

      // 主要逻辑做在这里
      evaluatePage: () => {
        const contentUrls = []
        $('.article .topics tr').each(function (index, element) {
          const $a = $(this).find('a')
          const href = $a.attr('href')
          contentUrls.push(href)
        })
        return {
          contentUrls,
        }
      },
      onSuccess: result => {
        if (!result.response.ok) {
          throw new Error(`出问题了。${result.response.status}, ${result.response.url}`)
        }
        // return
        const { contentUrls } = result.result
        console.log(`Got ${contentUrls.length} result for ${result.options.url}.`);
        // 把拉取回来的 content url queue 到 contentCrawler
        contentCrawler.queue(contentUrls)
      },
    });

    const contentCrawler = await HCCrawler.launch({
      ...COMMON_CRAWLER_CONFIG,

      evaluatePage: () => {
        debugger
        const title = $('.article h1').text()

        // 文案：rich-content topic-richtext，截取前 100 个字
        const contents = []
        $('.rich-content p').each(function () {
          const text = $(this).text()
          if (text) {
            contents.push(text)
          }
        })

        // 截取 images，.image-container .image-float-center img
        const images = []
        $('.image-container img').each(function() {
          const url = $(this).attr('src')
          images.push(url)
        })

        return {
          title,
          contents,
          images,
        }
      },

      // 写库到 mongodb 中
      onSuccess: result => {
        const articleId = result.options.url.split('/').slice(-2)[0]
        const article = new Article({
          _id: articleId,
          url: result.options.url,
          ...result.result,
        })
        article.save()
        console.log('article save!', articleId, result.result.title)
      },
    })

    // // 检测是否需要登录
    // if (isNeedLogin(result)) {
    //   await login()
    // }

    // 拉取内容。从 listCrawler 到 contentCrawler
    const urls = helper.generateListUrls()
    await listCrawler.queue(urls.slice(0, 2))
    await listCrawler.onIdle();
    debugger
    await listCrawler.close();
  } catch (error) {
    console.log(error)
  }
})();
