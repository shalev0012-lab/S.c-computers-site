// ─── FAQ Toggle ───
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ─── Accessibility Widget ───
var ACC_WRAP    = ['acc-big-text','acc-bigger-text','acc-high-contrast','acc-negative','acc-grayscale'];
var ACC_BODY    = ['acc-light-bg','acc-underline-links','acc-readable-font','acc-no-anim'];
var ACC_CLASSES = ACC_WRAP.concat(ACC_BODY);

function accEl(cls) {
  return ACC_WRAP.indexOf(cls) !== -1
    ? document.getElementById('page-wrap')
    : document.body;
}

function toggleAccessPanel() {
  document.getElementById('accessPanel').classList.toggle('open');
}

function toggleAcc(cls, btn) {
  var el = accEl(cls);
  var pairs = [['acc-big-text','acc-bigger-text'],['acc-high-contrast','acc-negative']];
  pairs.forEach(function(pair) {
    if (pair.indexOf(cls) !== -1) {
      var other = pair[0] === cls ? pair[1] : pair[0];
      if (accEl(other).classList.contains(other)) {
        accEl(other).classList.remove(other);
        document.querySelectorAll('.access-grid button').forEach(function(b) {
          var oc = b.getAttribute('onclick') || '';
          if (oc.indexOf(other) !== -1) b.classList.remove('active');
        });
      }
    }
  });
  el.classList.toggle(cls);
  btn.classList.toggle('active');
  saveAccState();
}

function resetAcc() {
  ACC_WRAP.forEach(function(c) { document.getElementById('page-wrap').classList.remove(c); });
  ACC_BODY.forEach(function(c) { document.body.classList.remove(c); });
  document.querySelectorAll('.access-grid button').forEach(function(b) { b.classList.remove('active'); });
  localStorage.removeItem('acc_state');
}

function saveAccState() {
  var wrap = document.getElementById('page-wrap');
  var active = ACC_CLASSES.filter(function(c) {
    return (ACC_WRAP.indexOf(c) !== -1 ? wrap : document.body).classList.contains(c);
  });
  localStorage.setItem('acc_state', JSON.stringify(active));
}

function loadAccState() {
  try {
    var saved = JSON.parse(localStorage.getItem('acc_state') || '[]');
    saved.forEach(function(cls) {
      accEl(cls).classList.add(cls);
      document.querySelectorAll('.access-grid button').forEach(function(btn) {
        var oc = btn.getAttribute('onclick') || '';
        if (oc.indexOf("'" + cls + "'") !== -1) btn.classList.add('active');
      });
    });
  } catch(e) {}
}

document.addEventListener('click', function(e) {
  var panel = document.getElementById('accessPanel');
  if (panel && panel.classList.contains('open') && !panel.contains(e.target) && !e.target.closest('.access-btn')) {
    panel.classList.remove('open');
  }
});

loadAccState();
