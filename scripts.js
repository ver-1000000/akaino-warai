let DEBUG = {};

addEventListener('load', async load => {
  const dom       = (query) => document.querySelector(query);
  const frame     = dom('.frame');
  const body      = dom('.body');
  const nose      = dom('.nose');
  const fangLeft  = dom('.fang .left');
  const fangRight = dom('.fang .right');
  const eyeLeft   = dom('.eye .left');
  const eyeRight  = dom('.eye .right');
  const topText   = dom('.top-text');
  DEBUG = { body, nose, fangLeft, fangRight, eyeLeft, eyeRight, topText };

  frame.onclick = e => {
    topText.innerHTML = 'Clicked';
  };
});
