
(function($) {
  'use strict';

  class Slider {
    constructor(element, settings) {
      this.element = element;
      this.settings = settings;
      this.initSettings();
      this.hideInput();
      this.createSliderElements();
      this.scaleElements();
      this.adjustMargins();
    }

    initSettings() {
      const { element, settings } = this;
      this.min = parseFloat(this.getAttrOrDefault('min', settings.min));
      this.max = parseFloat(this.getAttrOrDefault('max', settings.max));
      this.step = parseFloat(this.getAttrOrDefault('step', settings.step));
      this.value = parseFloat(this.getAttrOrDefault('value', (settings.max - settings.min) / 2 + settings.min));
      this.decimals = parseFloat(this.getAttrOrDefault('data-decimals', settings.decimals));
      this.prefix = this.getAttrOrDefault('data-prefix', settings.prefix);
      this.postfix = this.getAttrOrDefault('data-postfix', settings.postfix);
      this.toggleBubble = this.getAttrOrDefault('data-toggle-bubble', settings.toggleBubble);
      this.toggleLimit = parseFloat(this.getAttrOrDefault('data-toggle-limit', settings.toggleLimit));
      this.bubbleColor = this.getAttrOrDefault('data-bubble-color', settings.bubbleColor);
      this.bubbleFontScale = parseFloat(this.getAttrOrDefault('data-bubble-font-scale', settings.bubbleFontScale));
      this.bubbleFontColor = this.getAttrOrDefault('data-bubble-font-color', settings.bubbleFontColor);
      this.thumbScale = parseFloat(this.getAttrOrDefault('data-thumb-scale', settings.thumbScale));
      this.thumbColor = this.getAttrOrDefault('data-thumb-color', settings.thumbColor);
      this.thumbFontScale = parseFloat(this.getAttrOrDefault('data-thumb-font-scale', settings.thumbFontScale));
      this.thumbFontColor = this.getAttrOrDefault('data-thumb-font-color', settings.thumbFontColor);
      this.trackScale = parseFloat(this.getAttrOrDefault('data-track-scale', settings.trackScale));
      this.trackColor = this.getAttrOrDefault('data-track-color', settings.trackColor);
    }

    getAttrOrDefault(attr, defaultValue) {
      return this.removeCommas(this.element.attr(attr)) || defaultValue;
    }

    removeCommas(value) {
      return value ? value.replace(/,/g, '') : value;
    }

    hideInput() {
      this.element.hide();
    }

    createSliderElements() {
      this.slider = $('<div>').addClass('jquery-slider__wrap').insertAfter(this.element);
      this.minus = $('<div><span>-</span></div>').addClass('jquery-slider__minus').appendTo(this.slider);
      this.plus = $('<div><span>+</span></div>').addClass('jquery-slider__plus').appendTo(this.slider);
      this.track = $('<div>').addClass('jquery-slider__track').appendTo(this.slider);
      this.thumb = $('<div><span>').addClass('jquery-slider__thumb').appendTo(this.track);
      this.bubble = $('<div><span>').addClass('jquery-slider__bubble').appendTo(this.thumb);
      this.bubbleArrow = $('<div>').addClass('jquery-slider__bubble-arrow').prependTo(this.bubble);

      this.thumbSpan = this.thumb.find('span').first();
      this.bubbleSpan = this.bubble.find('span').first();
    }

    scaleElements() {
      this.scaleElement(this.bubble, this.bubbleFontScale, ['font-size', 'border-radius']);
      this.scaleElement(this.bubbleArrow, this.bubbleFontScale, ['width', 'height']);
      this.scaleElement(this.thumb, this.thumbScale, ['width', 'height']);
      this.scaleElement(this.thumbSpan, this.thumbFontScale, ['font-size']);
      this.scaleMinusPlus();
    }

    scaleElement(element, scale, properties) {
      if (scale !== 1) {
        properties.forEach(property => {
          element.css(property, `${parseFloat(element.css(property)) * scale}px`);
        });
      }
    }

    scaleMinusPlus() {
      if (this.trackScale !== 1) {
        this.scaleElement(this.minus, this.trackScale, ['width', 'height', 'font-size']);
        this.scaleElement(this.plus, this.trackScale, ['width', 'height', 'font-size']);
        this.track.css({
          left: `${parseFloat(this.minus.outerWidth()) * 1.2}px`,
          right: `${parseFloat(this.plus.outerWidth()) * 1.2}px`
        });
      }
    }

    adjustMargins() {
      if (this.bubbleFontScale !== 1 || this.thumbScale !== 1 || this.trackScale !== 1) {
        const trackHeight = Math.max(this.thumb.outerHeight(), this.plus.outerHeight());
        const bubbleHeight = this.bubble.outerHeight();
        this.slider.css({
          margin: `${trackHeight + bubbleHeight}px auto`
        });
      }
    }
  }

  // jQuery plugin setup
  $.fn.sliderPlugin = function(settings) {
    return this.each(function() {
      if (!$.data(this, 'sliderPlugin')) {
        $.data(this, 'sliderPlugin', new Slider($(this), settings));
      }
    });
  };

}(jQuery));
