数据库设计：

article
{
  articleId: string, // 提取豆瓣的 id
  url: string, // 链接
  title: string, // 标题
  contents: [], // 描述列表
  images: [], // 图片列表

  keywords: [], // 内容关键词，可以手动添加
  star: boolean, // 是否收藏
  black: boolean, // 是否黑名单
  isRead: boolean, // 是否已读
  createAt: number,
  updateAt: number, // 根据 UpdateAt 来排序
}

# 可以学习的
对 mongo DB、mongoose 的基本用法。
对新的库的用法，如 crawler。
对整体项目搭建的思考。

# 爬虫的工具
axios，很容易被 403 限制。

crawler，没看懂怎么去等待 queue 结束。

headless-chrome-crawler，走的 chrome，而且实现上比较易理解，可以用它来试试看。

# TODO
- [] 数据库迁移到线上（mongo DB）
- [] 挑选合适的 crawler 工具
- [] 代码抽象

# 注意
在测试的时候，必须限频。否则很容易就被限制住了。