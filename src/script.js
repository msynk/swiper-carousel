let _pointerDownX = 0;
let _isPointerDown = false;
let _translateX = 0;
let _pointerDownTime = 0;
let _lastX = 0;
let _lastDiffX = 0

const container = document.getElementById('container');
const swiper = document.getElementById('swiper');
const swiperWidth = [].slice.call(swiper.children).reduce((pre, cur) => pre + cur.offsetWidth, 0) - swiper.parentElement.offsetWidth;

container.addEventListener('pointermove', pointerMove)
container.addEventListener('pointerdown', pointerDown)
container.addEventListener('pointerup', pointerUp)
container.addEventListener('pointerleave', pointerUp)
// container.addEventListener('pointerout', e => (console.log('pointer out'), pointerUp(e)))

function pointerMove(e) {
  if (!_isPointerDown) return false;

  const clientX = e.clientX;
  const newDiffX = _lastX - clientX;

  if (newDiffX / Math.abs(newDiffX) != _lastDiffX / Math.abs(_lastDiffX)) {
    _pointerDownTime = Date.now();
  }

  _lastDiffX = newDiffX;
  _lastX = clientX;

  const delta = clientX - _pointerDownX;
  let x = _translateX + delta;
  // _translateX = x;
  swipe(x);
}

function pointerDown(e) {
  _isPointerDown = true;
  _pointerDownX = e.clientX;
  _pointerDownTime = Date.now();

  getTranslateX();

  swiper.style.cursor = 'grabbing';
  swiper.style.transitionDuration = '';
}

function pointerUp(e) {
  if (!_isPointerDown) return;
  _isPointerDown = false;
  swiper.style.cursor = '';

  const time = Date.now() - _pointerDownTime;
  const distance = Math.abs(e.clientX - _pointerDownX);

  getTranslateX();

  const swipeSpeed = distance / time;

  swiper.style.transitionDuration = swipeSpeed > 2 ? '300ms' : swipeSpeed > 1 ? '600ms' : '1000ms';

  swipe(-(_lastDiffX / Math.abs(_lastDiffX)) * (swiperWidth * swipeSpeed / 10) + _translateX);

  setTimeout(() => {
    swiper.style.transitionDuration = '';
  }, 1000 / swipeSpeed);
}

function swipe(x) {
  if (x > 0) x = 0;
  if (x < -swiperWidth) x = -swiperWidth;

  swiper.style.transform = `translateX(${x}px)`;
}

function getTranslateX() {
  const computedStyle = window.getComputedStyle(swiper);
  const matrix = computedStyle.getPropertyValue('transform');
  const matched = matrix.match(/matrix\((.+)\)/);

  if (matched && matched.length > 1) {
    const splitted = matched[1].split(',');
    _translateX = +splitted[4];
  } else {
    _translateX = 0;
  }
}