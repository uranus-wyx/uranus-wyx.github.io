particlesJS.load('particles-js', 'particles.json', function() {
  console.log('Particles.js load successfully！');
});

document.addEventListener("DOMContentLoaded", function () {
  ScrollReveal().reveal('.event', { 
      distance: '50px', 
      duration: 1000, 
      easing: 'ease-in-out', 
      origin: 'left',
      opacity: 1,  // 確保不會被設定為透明
      reset: true   // 滾動回來時重新觸發
  });
});

function flipCard(card) {
  card.classList.toggle("flipped");
}

function showDetails(event) {
  // 移除其他 active 狀態，確保只有一個 event 會展開
  document.querySelectorAll('.event').forEach(el => {
      if (el !== event) el.classList.remove('active');
  });

  // 切換 active 狀態
  event.classList.toggle('active');
}



