const config = require('./config')

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

module.exports = {
  generateListUrls,
}
