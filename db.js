const mongoose = require('mongoose')

exports.Article = mongoose.model('Article', {
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
