// const superagent = require('superagent')
const axios = require('axios')
const cheerio = require('cheerio')
const Crawler = require('crawler')
const config = require('./config')
const { Article } = require('./db')
const { generateListUrls } = require('./helper')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/douban-rent-house', {useNewUrlParser: true, useUnifiedTopology: true});

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
