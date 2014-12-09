/** =======================================================================
 * Bootstrap: alert.js v4.0.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================
 * @fileoverview - Bootstrap's generic alert component. Add dismiss
 * functionality to all alert messages with this plugin.
 *
 * Public Methods & Properties:
 *
 *   + $.alert
 *   + $.alert.noConflict
 *   + $.alert.Constructor
 *   + $.alert.Constructor.VERSION
 *   + $.alert.Constructor.prototype.close
 *
 * ========================================================================
 */

'use strict';


/**
 * Our Alert class.
 * @param {Element=} opt_element
 * @constructor
 */
var Alert = function (opt_element) {
  if (opt_element) {
    $(opt_element).on('click', Alert._DISMISS_SELECTOR, Alert._handleDismiss(this))
  }
}


/**
 * @const
 * @type {string}
 */
Alert['VERSION'] = '4.0.0'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._NAME = 'alert'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._DATA_KEY = 'bs.alert'


/**
 * @const
 * @type {string}
 * @private
 */
Alert._DISMISS_SELECTOR = '[data-dismiss="alert"]'


/**
 * @const
 * @type {number}
 * @private
 */
Alert._TRANSITION_DURATION = 150


/**
 * @const
 * @type {Function}
 * @private
 */
Alert._JQUERY_NO_CONFLICT = $.fn[Alert._NAME]


/**
 * @const
 * @enum {string}
 * @private
 */
Alert._Event = {
  CLOSE  : 'close.bs.alert',
  CLOSED : 'closed.bs.alert'
}


/**
 * @const
 * @enum {string}
 * @private
 */
Alert._ClassName = {
  ALERT : 'alert',
  FADE  : 'fade',
  IN    : 'in'
}


/**
 * Provides the jquery interface for the alert component.
 * @param {string=} opt_config
 * @this {jQuery}
 * @return {jQuery}
 * @private
 */
Alert._jQueryInterface = function (opt_config) {
  return this.each(/** @this {Element} */ (function () {
    var $this = $(this)

    var data  = $this.data(Alert._DATA_KEY)

    if (!data) {
      data = new Alert(this)
      $this.data(Alert._DATA_KEY, data)
    }

    if (opt_config === 'close') {
      data[opt_config](this)
    }
  }))
}


/**
 * Close the alert component
 * @param {Alert} alertInstance
 * @return {Function}
 * @private
 */
Alert._handleDismiss = function (alertInstance) {
  return function (event) {
    if (event) {
      event.preventDefault()
    }

    alertInstance['close'](this)
  }
}


/**
 * Close the alert component
 * @param {Element} element
 */
Alert.prototype['close'] = function (element) {
  var rootElement = this._getRootElement(element)
  var customEvent = this._triggerCloseEvent(rootElement)

  if (customEvent.isDefaultPrevented()) return

  this._removeElement(rootElement)
}


/**
 * Tries to get the alert's root element
 * @return {Element}
 * @private
 */
Alert.prototype._getRootElement = function (element) {
  var parent = false
  var target = element.getAttribute('data-target')

  if (!target) {
    target = element.getAttribute('href')
  }

  if (target && /\w/.test(target)) {
    parent = document.querySelector(target)
  }

  if (!parent) {
    parent = $(element).closest('.' + Alert._ClassName.ALERT)[0]
  }

  return parent
}


/**
 * Trigger close event on element
 * @return {$.Event}
 * @private
 */
Alert.prototype._triggerCloseEvent = function (element) {
  var closeEvent = $.Event(Alert._Event.CLOSE)
  $(element).trigger(closeEvent)
  return closeEvent
}


/**
 * Trigger closed event and remove element from dom
 * @private
 */
Alert.prototype._removeElement = function (element) {
  element.classList.remove(Alert._ClassName.IN)

  if (!Bootstrap.transition || !element.classList.contains(Alert._ClassName.FADE)) {
    this._destroyElement(element)
    return
  }

  $(element)
    .one(Bootstrap.TRANSITION_END, this._destroyElement.bind(this, element))
    .emulateTransitionEnd(Alert._TRANSITION_DURATION)
}


/**
 * clean up any lingering jquery data and kill element
 * @private
 */
Alert.prototype._destroyElement = function (element) {
  $(element)
    .detach()
    .trigger(Alert._Event.CLOSED)
    .remove()
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
$.fn[Alert._NAME] = Alert._jQueryInterface


/**
 * @const
 * @type {Function}
 */
$.fn[Alert._NAME]['Constructor'] = Alert


/**
 * @return {Function}
 */
$.fn[Alert._NAME]['noConflict'] = function () {
  $.fn[Alert._NAME] = Alert._JQUERY_NO_CONFLICT
  return Alert._jQueryInterface
}


/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

$(document).on('click.bs.alert.data-api', Alert._DISMISS_SELECTOR, Alert._handleDismiss(new Alert))
