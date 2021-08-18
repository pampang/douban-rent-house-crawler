// const superagent = require('superagent')
const axios = require('axios')
const cheerio = require('cheerio')
const Crawler = require('crawler')
const config = require('./config')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/douban-rent-house', {useNewUrlParser: true, useUnifiedTopology: true});

const Article = mongoose.model('Article', {
  _id: String, // 提取豆瓣的 id
  url: String, // 链接
  fromGroup: [Number], // 发现的组
  searchKeywords: [String], // 搜索关键词
  title: String, // 标题
  contents: [String], // 描述列表
  images: [String], // 图片列表
  keywords: [String], // 内容关键词，可以手动添加
  star: Boolean, // 是否收藏
  black: Boolean, // 是否黑名单
  isRead: Boolean, // 是否已读
  // createAt: Number,
  // updateAt: Number, // 根据 UpdateAt 来排序
})

function generateListUrls() {
  const { BASE_URL, GROUP_ID_LIST, SEARCH_KEYWORDS } = config
  const urls = []
  GROUP_ID_LIST.forEach(groupid => {
    const tempUrl = BASE_URL + `&group=${groupid}`
    SEARCH_KEYWORDS.forEach(kw => {
      urls.push(tempUrl + `&q=${encodeURIComponent(kw)}`)
    })
  })

  return urls
}

const listCrawler = new Crawler({
  maxConnections: 10,
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      $('.article .topics tr').each(function (index, element) {
        const $a = $(this).find('a')
        const href = $a.attr('href')
        contentUrls.push(href)
      })
    }
    done();
  }
})

const articleCrawler = new Crawler({
  // maxConnections: 10,
  rateLimit: 2000,
  maxConnections: 1,
  callback: (error, res, done) => {
    if (error) {
      console.log(error);
    } else {
      const $ = res.$;
      const articleId = url.split('/').slice(-2)[0]
      const title = $('.article h1').text()

      // 文案：rich-content topic-richtext，截取前 100 个字
      const contents = []
      $('.rich-content p').each(function () {
        const text = $(this).text()
        if (text) {
          contents.push(text)
        }
      })
    }
    done();
  }
})

async function fetchList(url) {
  const html = await getHtml(url)

  const contentUrls = []
  const $ = cheerio.load(html)
  $('.article .topics tr').each(function (index, element) {
    const $a = $(this).find('a')
    const href = $a.attr('href')
    contentUrls.push(href)
  })

  // TODO: 实现翻页逻辑

  return contentUrls
}

async function fetchContent(url) {
  const html = await getHtml(url)

  const $ = cheerio.load(html)

  const articleId = url.split('/').slice(-2)[0]
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

  console.log(contents)
  console.log(images)

  return {
    _id: articleId,
    url,
    title,
    contents,
    images,
  }
}

async function getHtml(url) {
  const { USER_AGENT } = config
  const res = await axios.get(url, {
    responseType: 'text',
    headers: {
      'User-Agent': USER_AGENT,
    },
  }).catch(error => {
    console.log('error: ', url, error.message)
    throw error
  })

  return res.data
}

async function runner() {
  const urls = generateListUrls()
  console.log(urls)

  urls.forEach(async url => {
    // 因为爬虫太多，被 403 了
    const contentUrls = await fetchList(url)
    console.log(contentUrls)
    contentUrls.forEach(async cUrl => {
      const pageContent = await fetchContent(cUrl)
      const article = new Article({
        ...pageContent,
      })
      article.save()
      console.log('ok')
    })
  })
}

runner()
