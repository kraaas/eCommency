export default class History {
  constructor({ root, onChange }) {
    if (root && root !== '/') {
      // make sure there's the starting slash
      if (root.charAt(0) !== '/') {
        root = '/' + root
      }
      // remove trailing slash
      this.root = root.replace(/\/$/, '')
      this.rootRE = new RegExp('^\\' + this.root)
    } else {
      this.root = null
    }
    this.onChange = onChange
    const baseEl = document.querySelector('base')
    this.base = baseEl && baseEl.getAttribute('href')
  }

  start() {
    this.listener = (e) => {
      let url = location.pathname + location.search
      if (this.root) {
        url = url.replace(this.rootRE, '') || '/'
      }
      this.onChange(url, e && e.state, location.hash)
    }
    window.addEventListener('popstate', this.listener)
    this.listener()
  }

  stop() {
    window.removeEventListener('popstate', this.listener)
  }

  go(path) {
    history.replaceState({
      pos: {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }, '', location.href)
    history.pushState({}, '', path)
    this.onChange(path)
  }
}
