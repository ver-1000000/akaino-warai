const random = (range = 100) => Math.round(Math.random() * range);

const QUERY_NAME_MAP = {
  '.body': '身体―― Body',
  '.nose': '鼻―― Nose',
  '.fang .left': '左のキバ―― Left Fang',
  '.fang .right': '右のキバ―― Right Fang',
  '.eye .left': '左目―― Left Eye',
  '.eye .right': '右目―― Right Eye',
};

class Entity {
  uniqQuery;
  name;
  element;
  animationFrame = null;

  set fill(value) {
    this.element.setAttribute('fill', value);
  }

  set stroke(value) {
    this.element.setAttribute('stroke', value);
  }

  set transform(value) {
    this.element.setAttribute('transform', value);
  }

  set transformOrigin(value) {
    this.element.setAttribute('transform-origin', value);
  }

  constructor(uniqQuery) {
    this.uniqQuery = uniqQuery;
    this.name      = QUERY_NAME_MAP[uniqQuery] || '';
    this.element   = document.querySelector(uniqQuery);
  }

  classRemove(...tokens) {
    this.element.classList.remove(tokens);
  }

  classAdd(...tokens) {
    this.element.classList.add(tokens);
  }
}

class Service {
  bgColor         = '';
  accentColor     = '';
  world;
  topText;
  saveImageButton;
  tweetButton;
  resetButton;
  cloneWorldNode;

  constructor() {
    this.reset();
  }

  updateTopText(text = '') {
    this.topText.element.innerHTML = text;
  }

  appearButtons() {
    const buttons = new Entity('.buttons');
    buttons.classRemove('hidden');
  }

  reset() {
    if (this.cloneWorldNode) {
      this.world.element.parentNode.replaceChild(this.cloneWorldNode, this.world.element);
    }
    this.world           = new Entity('.world');
    this.topText         = new Entity('.top .text');
    this.saveImageButton = new Entity('.bottom .left.button');
    this.tweetButton     = new Entity('.bottom .center.button');
    this.resetButton     = new Entity('.bottom .right.button');
    this.cloneWorldNode  = this.world.element.cloneNode(true);

    const hue            = random(360);
    this.bgColor         = `hsl(${hue}, 100%, 70%)`;
    this.accentColor     = `hsl(${(hue - 90) % 360}, 100%, 40%)`;
    this.topText.stroke  = this.accentColor;

    this.world.classRemove('loading');
    this.world.element.style.setProperty('background-color', this.bgColor);
    this.updateTopText('クリックすると始まるよ！―― Click to Start!');
    new Game(this);
  }
}

class Game {
  animEntities  = Object.keys(QUERY_NAME_MAP).map(x => new Entity(x));
  currentEntity = null;
  service;

  constructor(service) {
    this.service = service;
    this.start();
  }

  start() {
    const resetButtonClick = e => {
      e.stopPropagation();
      this.service.reset();
      this.service.resetButton.element.removeEventListener('click', resetButtonClick);
    };
    const worldClick = () => {
      if (this.currentEntity == null) {
        // 初回
        this.animEntities.forEach(entity => this.animate(entity));
        this.currentEntity = this.animEntities[0];
      } else {
        // 初回以降
        cancelAnimationFrame(this.currentEntity.animationFrame);
        this.currentEntity.animationFrame = null;
        this.currentEntity.stroke         = null;
        this.currentEntity                = this.animEntities[this.animEntities.indexOf(this.currentEntity) + 1];
      }
      if (this.currentEntity) {
        // 終了以前
        this.service.updateTopText(this.currentEntity.name);
        this.currentEntity.stroke = this.service.accentColor;
      } else {
        // 終了処理
        this.finish();
        this.service.world.element.removeEventListener('click', worldClick);
      }
    };
    this.service.resetButton.element.addEventListener('click', resetButtonClick);
    this.service.world.element.addEventListener('click', worldClick);
  }

  finish() {
    this.service.world.classAdd('loading');
    this.service.updateTopText('完成！―― Finish!');
    this.service.appearButtons();
  }

  animate(entity) {
    const update = ({ origin, x, y, scale, rotate, stop })=> {
      const dOrigin          = 50 + Math.abs(5 - origin);
      const dScale           = 0.5 + Math.abs(scale);
      const dX               = 64 - Math.abs(128 - x);
      const dY               = 64 - Math.abs(128 - x);
      entity.transform       = `translate(${dX} ${dY}) scale(${dScale}) rotate(${rotate})`;
      entity.transformOrigin = `${dOrigin}px ${40}px`;
      origin                 = (origin + 1) % 10;
      x                      = (x + 7) % 256;
      y                      = (y + 3) % 256;
      scale                  = ((scale + 5) * 10 + 1) % 100 / 10 - 5;
      rotate                 = (rotate + 9) % 360;
      entity.animationFrame  = requestAnimationFrame(() => update({ origin, x, y, scale, rotate }));
    };
    update({ origin: random(10), x: random(128), y: random(128), scale: random(5), rotate: random(360) });
  };
};

addEventListener('load', async load => {
  const service = new Service();
});
