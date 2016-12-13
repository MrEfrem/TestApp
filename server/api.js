const posts = [
  {
    name: 'My first todo',
    date: '2016-12-01'
  },
  {
    name: 'My second todo',
    date: '2016-12-02'
  },
  {
    name: 'My third todo',
    date: '2016-12-03'
  }
]


export default (router) => {
  // Processing login
  router.get('/api/login', function *() { // eslint-disable-line
    this.session = {
      logged: true
    }
    this.redirect('/')
  })

  // Processing logout
  router.get('/api/logout', function *() { // eslint-disable-line
    this.session = {
      logged: false
    }
    this.redirect('/')
  })

  // Processing get posts
  router.get('/api/posts', function *() { // eslint-disable-line
    this.type = 'application/json'
    this.body = JSON.stringify(posts)
  })

  // Processing add posts
  router.put('/api/posts/add', function *() { // eslint-disable-line
    const { name } = this.request.body
    if (!name) {
      throw new Error('Name must be filled')
    }
    const curDate = new Date()
    posts.push({
      name: this.request.body.name,
      date: `${curDate.getUTCFullYear()}-${`0${curDate.getUTCMonth() + 1}`.substr(-2)}-${`0${curDate.getUTCDate()}`.substr(-2)}`
    })
    this.body = ''
  })

  return router
}
