import Router from './assets/lib/e-router.js'

const router = new Router()

router.map({
  '/': {
    component: (resolve) => {
      require(['./home/home.js'], resolve)
    }
  },
  '/buycar': {
    component: (resolve) => {
      require(['./buycar/buycar.js'], resolve)
    }
  },
  '/user': {
    component: (resolve) => {
      require(['./user/user.js'], resolve)
    },
    auth: true
  }
})

router.beforeEach(transition => {
  if (transition.to.auth) {
    transition.abort()
    alert('您还未登录！')
  } else {
    transition.next()
  }
})

router.start('#app')
