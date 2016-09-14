

/**
 * noop
 */
export function noop() {

}

export function getCSSTranstionTime(node) {
  let time = 0
  const cssTransition = getComputedStyle(node).transition
  if (cssTransition) {
    time = cssTransition.split(/\s+/)[1]
  }
  return parseFloat(time)
}

export function query(selector) {
  let el
  if(typeof selector == 'string') {
    el = document.querySelector(selector)
  }
  return el
}
