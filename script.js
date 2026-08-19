let count = 0;

const counterDisplay = document.getElementById('counter');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');

incrementBtn.addEventListener('click', () => {
  count++;
  counterDisplay.textContent = count;
});

decrementBtn.addEventListener('click', () => {
  count--;
  counterDisplay.textContent = count;
});
