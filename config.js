// https://www.douban.com/group/search?cat=1013&group=129657&sort=time  广州租房
// https://www.douban.com/group/search?cat=1013&group=90742&sort=time   广州租房
// https://www.douban.com/group/search?cat=1013&group=496744&sort=time  广州租房 海珠租房

// 必填参数：q, start
const BASE_URL = 'https://www.douban.com/group/search?cat=1013&sort=time'
const MAX_LENGTH = 50
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'

const GROUP_ID_LIST = [
  90742,  // 广州租房
  129657, // 广州租房
  496744, // 广州租房 海珠租房
]

const SEARCH_KEYWORDS = [
  '广州塔',
  '鹭江',
  '五羊',
]

const ARTICLE_KEYWORDS = [
  '女生',
  '男生',
  // X房
  // 合租
]

module.exports = {
  MAX_LENGTH,
  BASE_URL,
  USER_AGENT,
  GROUP_ID_LIST,
  SEARCH_KEYWORDS,
  ARTICLE_KEYWORDS,
}
