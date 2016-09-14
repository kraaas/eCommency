import * as util from './util'
import History from './history'
import Transition from './transition'

class Router {
  constructor({} = {}) {
    this._$view = util.query("[router-view]")
    this.transition = this._$view.getAttribute('transition')
    this._routes = []
    this._currentRoute = {}
    this._nextRoute = {}
    this._currentPath = ''
    this.isLeaving = false
    this.leaveTimer = null
    this._beforeEach = []
    this._beforeEachCursor = 0
    this._next = true
    this.history = new History({
      onChange: (path) => {
        this._match(path)
      }
    })
  }

  // public api 

  /** 
   * create route map
   * @param  {Object} map
   * @return {Router}
   */
  map(map) {
    for (const url in map) {
      let route = map[url]
      route.url = url
      route.count = 0
      this.on(route)
    }
    return this
  }

  /**
   * start router
   * @param  {String|Element}
   * @return {Router}
   */
  start(container) {
    if (!container) {
      throw new Error(
        'Must start e-router with a component and a ' +
        'root container.'
      )
    }
    this.$container = util.query(container)
    this._scanElink()
    this.history.start()
    return this
  }

  /**
   * register route from map
   * @param  {Object} router
   * @return {Router}
   */
  on(route) {
    const exist = this._routes.filter(r => r.url === route.url)[0]
    if (exist) {
      throw new Error(`route ${route.url} is existed`)
    }
    this._routes.push(route)
    return this
  }

  /**
   * pushstate
   * @param  {String} path
   * @return {Router}
   */
  go(path) {
    this._beforeEachCursor = 0
    let route =  this._nextRoute = this._getRoute(path)
    if (route) {
      this._walkBeforeEach(this._beforeEachCursor)
      if (this._next) {
        this.history.go(route.url)
      }
    }
    return this
  }

  /**
   * stop the router
   * @return {Router}
   */
  stop() {
    this.history.stop()
  }

  /**
   * beforeEach hook
   * @param  {Function} beforeEach
   * @return {[type]}
   */
  beforeEach(beforeEach) {
    if (typeof beforeEach === 'function') {
      this._beforeEach.push(beforeEach)
    } else {
      throw new Error('beforeEach should be a function!')
    }
  }

  // internal api
  _scanElink() {
    this.$container.addEventListener('click', e => {
      const target = e.target
      const link = target.getAttribute('e-link')
      if (link) {
        this.go(link)
      }
    }, false)
  }

  _walkBeforeEach(cursor) {
    const beforeFn = this._beforeEach[cursor]
    if (beforeFn) {
      beforeFn(new Transition({
        Router: this,
        to: this._nextRoute,
        from: this._currentRoute
      }))
    }
  }

  _match(path) {
    const match = path.match(/(.*)\?(.*)/)
    let route
    if (match) {
      path = match[1]
    }
    if (this._currentPath === path) return
    this._currentPath = path
    route = this._currentRoute = this._getRoute(path)
    if (route) {
      this._leave()
      if (typeof route.component === 'function') {
        route.component((resolve) => {
          resolve.controller()
          this._enter(resolve.template)
        })
      } else {
        this._enter(content)
      }
    }
  }

  _getRoute(path) {
    const route = this._routes.filter(r => r.url === path)[0]
    if (!route) {
      throw new Error(`can not find the path 
        ${path} in your routerMap!`)
    }
    return route
  }

  _leave() {
    const child = this._$view.children[0]
    if (child) {
      const transitionTime = util.getCSSTranstionTime(child)
      if (this.transition) {
        child.classList.add(`${this.transition}-leave`)
      }
      setTimeout(() => {
        child.parentNode.removeChild(child)
      }, transitionTime * 1000)
    }
  }

  _enter(content) {
    const node = document.createElement('div')
    node.innerHTML = content
    this._$view.appendChild(node)
    if (this.transition) {
      let transitionName = `${this.transition}-transition`
      let transitionEnter = `${this.transition}-enter`
      node.classList.add(transitionName)
      node.classList.add(transitionEnter)
      setTimeout(() => {
        node.classList.remove(transitionEnter)
      }, 16)
    }
  }
}

export default Router
