const _ = require('underscore-plus')
const {CompositeDisposable, Disposable} = require('atom')
const Tips = require('./tips')

// One <li>, holding the message and the control. Core's `.background-message.centered` is a flex
// row whose `li`s are each `width: 100%`, so a second <li> becomes a SIBLING FLEX ITEM and lands
// beside the text at the far right rather than under it. The button also has to sit outside
// `.message`, whose innerHTML is replaced on every tip.
const TEMPLATE = `\
<ul class="centered background-message">
  <li class="tip">
    <div class="message"></div>
    <button class="next-tip" tabindex="-1">Next tip</button>
  </li>
</ul>\
`

module.exports =
class TranquilTipsView {
  constructor () {
    this.element = document.createElement('background-tips')
    this.index = -1
    this.workspaceCenter = atom.workspace.getCenter()

    this.startDelay = 1000
    this.displayDuration = 10000
    this.fadeDuration = 300

    this.disposables = new CompositeDisposable()

    const visibilityCallback = () => this.updateVisibility()

    this.disposables.add(this.workspaceCenter.onDidAddPane(visibilityCallback))
    this.disposables.add(this.workspaceCenter.onDidDestroyPane(visibilityCallback))
    this.disposables.add(this.workspaceCenter.onDidChangeActivePaneItem(visibilityCallback))

    // Track window focus via the renderer's own DOM events, NOT
    // atom.getCurrentWindow().on(...). The latter registers listeners on the
    // main-process BrowserWindow — a Node EventEmitter that OUTLIVES renderer
    // reloads — so across many window reloads they accumulate and trip Node's
    // MaxListenersExceededWarning ("11 focus listeners added to [BrowserWindow]").
    // DOM window focus/blur are renderer-scoped, die with the window, and we
    // still remove them on destroy.
    window.addEventListener('blur', visibilityCallback)
    window.addEventListener('focus', visibilityCallback)

    this.disposables.add(new Disposable(() => window.removeEventListener('blur', visibilityCallback)))
    this.disposables.add(new Disposable(() => window.removeEventListener('focus', visibilityCallback)))

    this.startTimeout = setTimeout(() => this.start(), this.startDelay)
  }

  destroy () {
    this.stop()
    this.disposables.dispose()
  }

  attach () {
    this.element.innerHTML = TEMPLATE
    this.message = this.element.querySelector('.message')

    // attach() rebuilds the DOM from TEMPLATE each time, so this listener goes on a fresh node
    // and dies with it — nothing to clean up. mousedown, not click: the overlay sits over an
    // empty pane, and waiting for mouseup lets a stray drag swallow the press.
    const next = this.element.querySelector('.next-tip')
    if (next) {
      next.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return
        event.preventDefault()
        this.nextTip()
      })
    }

    const paneView = atom.views.getView(this.workspaceCenter.getActivePane())
    const itemViews = paneView.querySelector('.item-views')
    let top = 0
    if (itemViews && itemViews.offsetTop) {
      top = itemViews.offsetTop
    }

    this.element.style.top = top + 'px'
    paneView.appendChild(this.element)
  }

  detach () {
    this.element.remove()
  }

  updateVisibility () {
    if (this.shouldBeAttached()) {
      this.start()
    } else {
      this.stop()
    }
  }

  shouldBeAttached () {
    return this.workspaceCenter.getPanes().length === 1 &&
    this.workspaceCenter.getActivePaneItem() == null &&
    document.hasFocus()
  }

  start () {
    if (!this.shouldBeAttached() || this.interval != null) return
    this.renderTips()
    this.randomizeIndex()
    this.attach()
    this.showNextTip()
    this.interval = setInterval(() => this.showNextTip(), this.displayDuration)
  }

  stop () {
    this.element.remove()
    if (this.interval != null) {
      clearInterval(this.interval)
    }

    clearTimeout(this.startTimeout)
    clearTimeout(this.nextTipTimeout)
    this.interval = null
  }

  randomizeIndex () {
    const len = Tips.length
    this.index = Math.round(Math.random() * len) % len
  }

  nextTip () {
    if (!this.message) return
    this.showNextTip()
    // Restart the dwell, so a tip you asked for gets its full display duration rather than
    // whatever was left of the previous one's — clicking just before a tick would otherwise
    // flip straight past the tip you wanted.
    if (this.interval != null) {
      clearInterval(this.interval)
      this.interval = setInterval(() => this.showNextTip(), this.displayDuration)
    }
  }

  showNextTip () {
    this.index = ++this.index % Tips.length
    this.message.classList.remove('fade-in')
    // Drop any pending fade: repeated clicks inside the fade window would otherwise each land
    // their own timeout and the text would flicker through several tips.
    clearTimeout(this.nextTipTimeout)
    this.nextTipTimeout = setTimeout(() => {
      this.message.innerHTML = Tips[this.index]
      this.message.classList.add('fade-in')
    }, this.fadeDuration)
  }

  renderTips () {
    if (this.tipsRendered) return
    for (let i = 0; i < Tips.length; i++) {
      const tip = Tips[i]
      Tips[i] = this.renderTip(tip)
    }
    this.tipsRendered = true
  }

  renderTip (str) {
    str = str.replace(/\{(.+)\}/g, (match, command) => {
      let binding, scope
      const scopeAndCommand = command.split('>')
      if (scopeAndCommand.length > 1) {
        [scope, command] = scopeAndCommand
      }
      const bindings = atom.keymaps.findKeyBindings({command: command.trim()})

      if (scope) {
        for (binding of bindings) {
          if (binding.selector === scope) break
        }
      } else {
        binding = this.getKeyBindingForCurrentPlatform(bindings)
      }

      if (binding && binding.keystrokes) {
        const keystrokeLabel = _.humanizeKeystroke(binding.keystrokes).replace(/\s+/g, '&nbsp')
        return `<span class="keystroke">${keystrokeLabel}</span>`
      } else {
        return command
      }
    })
    return str
  }

  getKeyBindingForCurrentPlatform (bindings) {
    if (!bindings || !bindings.length) return
    for (let binding of bindings) {
      if (binding.selector.indexOf(process.platform) !== -1) {
        return binding
      }
    }
    return bindings[0]
  }
}
