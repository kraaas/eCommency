export default class Transition {
  constructor({
    Router = function() {
      throw new Error('Router is needed!')
    },
    to = {},
    from = {}
  } = {}) {
    this.to = to
    this.from = from
    this.Router = Router
  }
  abort() {
  	this.Router._next = false
  }
  next() {
  	this.Router._next = true
    this.Router._walkBeforeEach(++this.Router._beforeEachCursor)
  }
  redirect() {

  }
}
