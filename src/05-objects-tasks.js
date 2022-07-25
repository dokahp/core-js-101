/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

// const { getAverage } = require('./02-numbers-tasks');

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  let obj = {};
  obj = { ...JSON.parse(json) };
  Object.setPrototypeOf(obj, proto);
  return obj;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more example see unit tests.
 */

const cssSelectorBuilder = {
  resultString: '',
  elementOrder: 0,
  idOrder: 0,
  pseudoOrder: 0,
  twiceTimeError: 'Element, id and pseudo-element should not occur more then one time inside the selector',
  orderError: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
  element(value) {
    this.checkQueueCorrectness(1);
    const builder = Object.create(cssSelectorBuilder);
    builder.elementOrder = this.elementOrder + 1;
    if (builder.elementOrder > 1) {
      throw new Error(this.twiceTimeError);
    }
    this.order = 1;
    builder.resultString += `${this.resultString}${value}`;
    return builder;
  },

  id(value) {
    this.checkQueueCorrectness(2);
    const builder = Object.create(cssSelectorBuilder);
    builder.idOrder = this.idOrder + 1;
    builder.order = 2;

    if (builder.idOrder > 1) {
      throw new Error(this.twiceTimeError);
    }
    builder.resultString = `${this.resultString}#${value}`;
    return builder;
  },

  class(value) {
    this.checkQueueCorrectness(3);
    const builder = Object.create(cssSelectorBuilder);
    builder.order = 3;
    builder.resultString = `${this.resultString}.${value}`;
    return builder;
  },

  attr(value) {
    this.checkQueueCorrectness(4);
    const builder = Object.create(cssSelectorBuilder);
    builder.order = 4;
    builder.resultString = `${this.resultString}[${value}]`;
    return builder;
  },

  pseudoClass(value) {
    this.checkQueueCorrectness(5);
    const builder = Object.create(cssSelectorBuilder);
    builder.order = 5;
    builder.resultString = `${this.resultString}:${value}`;
    return builder;
  },

  pseudoElement(value) {
    this.checkQueueCorrectness(6);
    const builder = Object.create(cssSelectorBuilder);
    builder.pseudoOrder = this.pseudoOrder + 1;
    builder.order = 6;
    if (builder.pseudoOrder > 1) {
      throw new Error(this.twiceTimeError);
    }
    builder.resultString = `${this.resultString}::${value}`;
    return builder;
  },

  stringify() {
    return this.resultString;
  },

  combine(selector1, combinator, selector2) {
    const builder = Object.create(cssSelectorBuilder);
    builder.resultString = `${selector1.resultString} ${combinator} ${selector2.resultString}`;
    return builder;
  },

  checkQueueCorrectness(num) {
    if (this.order > num) {
      throw new Error(this.orderError);
    }
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
