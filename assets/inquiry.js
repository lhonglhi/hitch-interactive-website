/* Hitch Interactive — Email Inquiry modal (bilingual).
   The destination address is not present in page markup or visible copy.
   Submissions POST to FormSubmit (no account needed; first submission emails
   ADDR an activation link that must be clicked once). If the request fails,
   falls back to opening the visitor's mail client. */
(function () {
  var ADDR = atob('c2FsZXNAaW50ZWxsaWdlbnRyYWNpbmcuY29t');
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + ADDR;

  var L = {
    en: {
      titles: { pricing: 'Pricing Request', rental: 'Rental Inquiry', courses: 'Course Inquiry', services: 'Services Inquiry', general: 'Contact Sales' },
      name: 'Your name', email: 'Your email', org: 'Organization (optional)',
      msg: 'Tell us about your needs', send: 'Send inquiry', cancel: 'Cancel',
      note: 'Submitting opens your email app with this inquiry pre-filled.'
    },
    zh: {
      titles: { pricing: '产品询价', rental: '租赁咨询', courses: '课程咨询', services: '服务咨询', general: '联系销售' },
      name: '您的姓名', email: '您的邮箱', org: '单位/公司（选填）',
      msg: '请描述您的需求', send: '发送咨询', cancel: '取消',
      note: '提交后将打开您的邮件应用并自动填好本次咨询内容。'
    }
  };

  function lang() { return window.__hitchLang === 'zh' ? 'zh' : 'en'; }

  function buildModal() {
    if (document.getElementById('inqModal')) return;
    var wrapDiv = document.createElement('div');
    wrapDiv.id = 'inqModal';
    wrapDiv.className = 'inq-overlay';
    wrapDiv.innerHTML =
      '<div class="inq-box" role="dialog" aria-modal="true">' +
      '<h3 id="inqTitle"></h3>' +
      '<p id="inqProduct" class="inq-prod"></p>' +
      '<input id="inqName" type="text">' +
      '<input id="inqEmail" type="email">' +
      '<input id="inqOrg" type="text">' +
      '<textarea id="inqMsg" rows="4"></textarea>' +
      '<p id="inqNote" class="inq-note"></p>' +
      '<div class="inq-actions">' +
      '<button id="inqCancel" class="inq-btn ghost" type="button"></button>' +
      '<button id="inqSend" class="inq-btn primary" type="button"></button>' +
      '</div></div>';
    document.body.appendChild(wrapDiv);
    wrapDiv.addEventListener('click', function (e) { if (e.target === wrapDiv) closeInquiry(); });
    document.getElementById('inqCancel').addEventListener('click', closeInquiry);
    document.getElementById('inqSend').addEventListener('click', sendInquiry);
  }

  var state = { kind: 'general', product: '' };

  window.openInquiry = function (kind, product) {
    buildModal();
    state.kind = kind || 'general';
    state.product = product || '';
    var t = L[lang()];
    document.getElementById('inqTitle').textContent = t.titles[state.kind] + (state.product ? ' — ' + state.product : '');
    document.getElementById('inqProduct').textContent = '';
    document.getElementById('inqName').placeholder = t.name;
    document.getElementById('inqEmail').placeholder = t.email;
    document.getElementById('inqOrg').placeholder = t.org;
    document.getElementById('inqMsg').placeholder = t.msg;
    document.getElementById('inqNote').textContent = FORM_ENDPOINT ? '' : t.note;
    document.getElementById('inqCancel').textContent = t.cancel;
    document.getElementById('inqSend').textContent = t.send;
    document.getElementById('inqModal').style.display = 'flex';
    return false;
  };

  window.closeInquiry = function () {
    var m = document.getElementById('inqModal');
    if (m) m.style.display = 'none';
  };

  function sendInquiry() {
    var t = L[lang()];
    var name = document.getElementById('inqName').value.trim();
    var email = document.getElementById('inqEmail').value.trim();
    var org = document.getElementById('inqOrg').value.trim();
    var msg = document.getElementById('inqMsg').value.trim();
    var subject = t.titles[state.kind] + (state.product ? ' — ' + state.product : '') + ' [hitchinteractive.com]';
    var body = (name ? 'Name: ' + name + '\n' : '') + (email ? 'Email: ' + email + '\n' : '') +
               (org ? 'Organization: ' + org + '\n' : '') + '\n' + msg;
    function mailtoFallback() {
      window.location.href = 'mailto:' + ADDR + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      closeInquiry();
    }
    if (FORM_ENDPOINT) {
      var btn = document.getElementById('inqSend');
      btn.disabled = true;
      fetch(FORM_ENDPOINT, { method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: subject, name: name, email: email, _replyto: email,
          organization: org, message: msg, _template: 'table' }) })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (String(j.success) !== 'true') throw new Error(j.message || 'send failed');
          closeInquiry();
          alert(lang() === 'zh' ? '已发送，谢谢！我们会尽快回复。' : 'Sent — thank you! We\'ll get back to you soon.');
        })
        .catch(mailtoFallback)
        .finally(function () { btn.disabled = false; });
    } else {
      mailtoFallback();
    }
  }
})();
