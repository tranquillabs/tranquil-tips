// @ts-nocheck
const {CompositeDisposable} = require('atom')
const TranquilTipsView = require('./tranquil-tips-view')

let view = null
let disposables = null

module.exports = {
  activate () {
    view = new TranquilTipsView()
    disposables = new CompositeDisposable()
    disposables.add(
      atom.commands.add('atom-workspace', {
        'tranquil-tips:next-tip': () => view && view.nextTip()
      })
    )
  },

  deactivate () {
    if (view) view.destroy()
    if (disposables) disposables.dispose()
  }
}
