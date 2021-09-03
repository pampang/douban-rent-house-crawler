const config = require('./config')

// 能否做一个偏函数来补 query?
// 加 groupid
// 加 queryString
// 加 start

// 基于前者传入的每一个结果，做固定逻辑的拓展

function extendQuery(input, operator) {
  if (!Array.isArray(input)) {
    input = [input]
  }

  const result = input.map(operator).flat()
  return result
}

// reduce flat

function generateListUrls() {
  const { BASE_URL } = config

  // 一般来说，会怎么组织呢？
  const urls = [BASE_URL].map((item) => {
    const { GROUP_ID_LIST } = config
    return GROUP_ID_LIST.map(groupid => item + `&group=${groupid}`)
  }).flat().map((item) => {
    const { SEARCH_KEYWORDS } = config
    return SEARCH_KEYWORDS.map(kw => item + `&q=${encodeURIComponent(kw)}`)
  }).flat().map((item) => {
    return [0, 50].map(start => item + `&start=${start}`)
  }).flat()

  return urls
}

module.exports = {
  generateListUrls,
}
