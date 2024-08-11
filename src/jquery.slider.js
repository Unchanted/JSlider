
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

  
  // colorize elements
      if (this.bubbleColor) {
        this.bubbleArrow.css('background', this.bubbleColor);
        this.bubble.css('background', this.bubbleColor);
      }
      if (this.bubbleFontColor) {
        this.bubbleSpan.css('color', this.bubbleFontColor);
      }
      if (this.thumbColor) {
        this.minus.css('color', this.thumbColor);
        this.plus.css('color', this.thumbColor);
        this.thumb.css('background', this.thumbColor);
      }
      if (this.thumbFontColor) {
        this.thumbSpan.css('color', this.thumbFontColor);
      }
      if (this.trackColor) {
        this.minus.css('border-color', this.trackColor);
        this.plus.css('border-color', this.trackColor);
        this.track.css('background', this.trackColor);
      }

      // other initial settings
      this.dragging = false;
      this.thumbOffset = this.thumb.outerWidth() / 2;

      // set number value and thumb position
      this.setValue(this.value);
      this.positionThumb(this.value);

      // set initial bubble state
      if (this.toggleBubble && (this.value.toString().length <= this.toggleLimit)) {
        this.bubble.hide();
        this.thumbSpan.show();
      } else {
        this.thumbSpan.hide();
      }

      // disables default touch actions for IE on thumb
      this.thumb.css('-ms-touch-action', 'none');

      // thumb events (mouse and touch)
      this.thumb.on('mousedown touchstart', (event) => {
        if (!this.dragging) {
          event.preventDefault();
          this.dragging = true;
          this.bubbleState(true);
        }
      });

      $('html')
        .on('mousemove touchmove', (event) => {
          if (this.dragging) {
            event.preventDefault();
            if (event.type === 'touchmove') {
              this.dragThumb(event.originalEvent.touches[0].pageX);
            } else {
              this.dragThumb(event.originalEvent.pageX);
            }
          }
        }).on('mouseup touchend', (event) => {
          if (this.dragging) {
            event.preventDefault();
            this.dragging = false;
            this.bubbleState(false);
          }
      });

      // minus button
      this.minus.on('click', (event) => {
        event.preventDefault();
        let newValue = this.value - this.step;
        newValue = Math.max(this.min, newValue);
        this.setValue(newValue);
        this.positionThumb(newValue);
      });

      // plus button
      this.plus.on('click', (event) => {
        event.preventDefault();
        let newValue = this.value + this.step;
        newValue = Math.min(this.max, newValue);
        this.setValue(newValue);
        this.positionThumb(newValue);
      });

      // adjust for window resize
      $(window).on('resize onorientationchange', () => {
        this.positionThumb(this.value);
      });
    }

    // drag slider thumb
    dragThumb(pageX) {
      const minPosition = this.track.offset().left + this.thumbOffset;
      const maxPosition = (this.track.offset().left + this.track.innerWidth()) - this.thumbOffset;

      // find new position for thumb
      let newPosition = Math.max(minPosition, pageX);
      newPosition = Math.min(maxPosition, newPosition);

      this.setValue(this.calcValue()); // set slider number

      // set the new thumb position
      this.thumb.offset({
        left: newPosition - this.thumbOffset
      });
    }

    // calculate value for slider
    calcValue() {
      const trackRatio = this.normalize(this.thumb.position().left, 0, this.track.innerWidth() - (this.thumbOffset * 2));
      return (trackRatio * (this.max - this.min)) + this.min;
    }

    // set new value for slider
    setValue(value) {
      this.value = (Math.round((value - this.min) / this.step) * this.step) + this.min; // find step value
      this.element.val(this.value); // update hidden input number
      const modValue = this.prefix + this.addCommas(this.value.toFixed(this.decimals)) + this.postfix; // modified number value
      this.thumbSpan.text(modValue); // update thumb number
      return this.bubbleSpan.text(modValue); // update bubble number
    }

}(jQuery));
