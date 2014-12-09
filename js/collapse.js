/** =======================================================================
 * Bootstrap: collapse.js v4.0.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's collapse plugin. Flexible support for
 * collapsible components like accordions and navigation.
 *
 * Public Methods & Properties:
 *
 *   + $.carousel
 *   + $.carousel.noConflict
 *   + $.carousel.Constructor
 *   + $.carousel.Constructor.VERSION
 *   + $.carousel.Constructor.Defaults
 *   + $.carousel.Constructor.Defaults.toggle
 *   + $.carousel.Constructor.Defaults.trigger
 *   + $.carousel.Constructor.Defaults.parent
 *   + $.carousel.Constructor.prototype.toggle
 *   + $.carousel.Constructor.prototype.show
 *   + $.carousel.Constructor.prototype.hide
 *
 * ========================================================================
 */

'use strict';


/**
 * Our collapse class.
 * @param {Element!} element
 * @param {Object=} opt_config
 * @constructor
 */
var Collapse = function (element, opt_config) {

  /** @private {Element} */
  this._element  = element

  /** @private {Object} */
  this._config = $.extend({}, Collapse['Defaults'], opt_config)

  /** @private {Element} */
  this._trigger = typeof this._config.trigger == 'string' ?
    document.querySelector(this._config.trigger) : this._config.trigger

  /** @private {boolean} */
  this._isTransitioning = false

  /** @private {?Element} */
  this._parent = this._config.parent ? this._getParent() : null

  if (!this._config.parent) {
    this._addAriaAndCollapsedClass(this._element, this._trigger)
  }

  if (this._config.toggle) {
    this['toggle']()
  }

}


/**
 * @const
 * @type {string}
 */
Collapse['VERSION'] = '4.0.0'


/**
 * @const
 * @type {Object}
 */
Collapse['Defaults'] = {
  'toggle'  : true,
  'trigger' : '[data-toggle="collapse"]',
  'parent'  : null
}


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._NAME = 'collapse'


/**
 * @const
 * @type {string}
 * @private
 */
Collapse._DATA_KEY = 'bs.collapse'


/**
 * @const
 * @type {number}
 * @private
 */
Collapse._TRANSITION_DURATION = 600


/**
 * @const
 * @type {Function}
 * @private
 */
Collapse._JQUERY_NO_CONFLICT = $.fn[Collapse._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Event = {
  SHOW   : 'show.bs.collapse',
  SHOWN  : 'shown.bs.collapse',
  HIDE   : 'hide.bs.collapse',
  HIDDEN : 'hidden.bs.collapse'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._ClassName = {
  IN         : 'in',
  COLLAPSE   : 'collapse',
  COLLAPSING : 'collapsing',
  COLLAPSED  : 'collapsed'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Collapse._Selector = {
  ACTIVES : '.panel > .in, .panel > .collapsing'
}


/**
 * Provides the jquery interface for the alert component.
 * @param {Object|string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Collapse._jQueryInterface = function (opt_config) {
  return this.each(function () {
    var $this   = $(this)
    var data    = $this.data(Collapse._DATA_KEY)
    var config = $.extend({}, Collapse['Defaults'], $this.data(), typeof opt_config == 'object' && opt_config)

    if (!data && config.toggle && opt_config == 'show') {
      config.toggle = false
    }

    if (!data) {
      data = new Collapse(this, config)
      $this.data(Collapse._DATA_KEY, data)
    }

    if (typeof opt_config == 'string') {
      data[opt_config]()
    }
  })
}


/**
 * Function for getting target element from element
 * @return {Element}
 * @private
 */
Collapse._getTargetFromElement = function (element) {
  var target = element.getAttribute('data-target')

  if (!target) {
    target = element.getAttribute('href')
  }

  return document.querySelector(target)
}


/**
 * Toggles the collapse element based on the presence of the 'in' class
 */
Collapse.prototype['toggle'] = function () {
  if (this._element.classList.contains(Collapse._ClassName.IN)) {
    this['hide']()
  } else {
    this['show']()
  }
}


/**
 * Show's the collapsing element
 */
Collapse.prototype['show'] = function () {
  if (this._isTransitioning || this._element.classList.contains(Collapse._ClassName.IN)) {
    return
  }

  var activesData, actives

  if (this._parent) {
    actives = this._parent.querySelectorAll(Collapse._Selector.ACTIVES)
    if (!actives.length) {
      actives = null
    }
  }

  if (actives) {
    activesData = $(actives).data(Collapse._DATA_KEY)
    if (activesData && activesData._isTransitioning) {
      return
    }
  }

  var startEvent = $.Event(Collapse._Event.SHOW)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) {
    return
  }

  if (actives) {
    Collapse._jQueryInterface.call($(actives), 'hide')
    if (!activesData) {
      $(actives).data(Collapse._DATA_KEY, null)
    }
  }

  var dimension = this._getDimension()

  this._element.classList.remove(Collapse._ClassName.COLLAPSE)
  this._element.classList.add(Collapse._ClassName.COLLAPSING)
  this._element.style[dimension] = 0
  this._element.setAttribute('aria-expanded', true)

  if (this._trigger) {
    this._trigger.classList.remove(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', true)
  }

  this._isTransitioning = true

  var complete = function () {
    this._element.classList.remove(Collapse._ClassName.COLLAPSING)
    this._element.classList.add(Collapse._ClassName.COLLAPSE)
    this._element.classList.add(Collapse._ClassName.IN)
    this._element.style[dimension] = ''

    this._isTransitioning = false

    $(this._element).trigger(Collapse._Event.SHOWN)
  }.bind(this)

  if (!Bootstrap.transition) {
    complete()
    return
  }

  var scrollSize = 'scroll' + (dimension[0].toUpperCase() + dimension.slice(1))

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)

  this._element.style[dimension] = this._element[scrollSize] + 'px'
}


/**
 * Hides's the collapsing element
 */
Collapse.prototype['hide'] = function () {
  if (this._isTransitioning || !this._element.classList.contains('in')) {
    return
  }

  var startEvent = $.Event(Collapse._Event.HIDE)
  $(this._element).trigger(startEvent)
  if (startEvent.isDefaultPrevented()) return

  var dimension = this._getDimension()

  Bootstrap.reflow(this._element)

  this._element.classList.add(Collapse._ClassName.COLLAPSING)
  this._element.classList.remove(Collapse._ClassName.COLLAPSE)
  this._element.classList.remove(Collapse._ClassName.IN)
  this._element.setAttribute('aria-expanded', false)

  if (this._trigger) {
    this._trigger.classList.add(Collapse._ClassName.COLLAPSED)
    this._trigger.setAttribute('aria-expanded', false)
  }

  this._isTransitioning = true

  var complete = function () {
    this._isTransitioning = false
    this._element.classList.remove(Collapse._ClassName.COLLAPSING)
    this._element.classList.add(Collapse._ClassName.COLLAPSE)
    $(this._element).trigger(Collapse._Event.HIDDEN)
  }.bind(this)

  this._element.style[dimension] = 0

  if (!Bootstrap.transition) {
    return complete()
  }

  $(this._element)
    .one(Bootstrap.TRANSITION_END, complete)
    .emulateTransitionEnd(Collapse._TRANSITION_DURATION)
}


/**
 * Returns the collapsing dimension
 * @return {string}
 * @private
 */
Collapse.prototype._getDimension = function () {
  var hasWidth = this._element.classList.contains('width')
  return hasWidth ? 'width' : 'height'
}


/**
 * Returns the parent element
 * @return {Element}
 * @private
 */
Collapse.prototype._getParent = function () {
  var selector = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]'
  var parent = document.querySelector(this._config.parent)
  var elements = parent.querySelectorAll(selector)

  for (var i = 0; i < elements.length; i++) {
    this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(elements[i]), elements[i])
  }

  return parent
}


/**
 * Returns the parent element
 * @param {Element} element
 * @param {Element} trigger
 * @private
 */
Collapse.prototype._addAriaAndCollapsedClass = function (element, trigger) {
  var isOpen = element.classList.contains(Collapse._ClassName.IN)
  element.setAttribute('aria-expanded', isOpen)

  if (trigger) {
    trigger.setAttribute('aria-expanded', isOpen)
    trigger.classList.toggle(Collapse._ClassName.COLLAPSED, !isOpen)
  }
}



/**
 * ------------------------------------------------------------------------
 * Jquery Interface + noConflict implementaiton
 * ------------------------------------------------------------------------
 */

/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME] = Collapse._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['Constructor'] = Collapse


/**
 * @const
 * @type {Function}
 */
$.fn[Collapse._NAME]['noConflict'] = function () {
  $.fn[Collapse._NAME] = Collapse._JQUERY_NO_CONFLICT
  return this
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (event) {
  event.preventDefault()

  var target = Collapse._getTargetFromElement(this)

  var data = $(target).data(Collapse._DATA_KEY)
  var config = data ? 'toggle' : $.extend({}, $(this).data(), { trigger: this })

  Collapse._jQueryInterface.call($(target), config)
})
