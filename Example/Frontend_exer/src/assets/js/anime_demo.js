class Anime {

  constructor(options = {}) {
    let {wraps, target} = options
    this.init(wraps, target)
  }

  init(wraps, target) {
    wraps = document.querySelectorAll(wraps)
    wraps.forEach(wrap => {
      let content = wrap.querySelector(target)
      wrap.addEventListener("mouseenter", function() {
        content.classList.add("active")
      })
      wrap.addEventListener("mouseleave", function() {
        content.classList.remove("active")
      })
    })
  }
}

