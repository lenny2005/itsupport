function switchTab(tabId, button) {
    document
      .querySelectorAll('.tab-content')
      .forEach(tab => tab.classList.remove('active'));
  
    document
      .querySelectorAll('.tab-btn')
      .forEach(btn => btn.classList.remove('active'));
  
    document.getElementById(tabId).classList.add('active');
    button.classList.add('active');
  }
  
  function generateQR() {
    const url = document.getElementById('qrUrl').value;
    if (!url) {
      alert('Please enter a valid Google Form URL.');
      return;
    }
  
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('qrCanvas');
      canvas.width = 300;
      canvas.height = 300;
      canvas.getContext('2d').drawImage(img, 0, 0);
      document.getElementById('qrOutput').style.display = 'block';
    };
  
    img.src =
      'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' +
      encodeURIComponent(url);
  }
  
  function copyScript() {
    const scriptText = document.getElementById('appsScript').textContent;
    navigator.clipboard.writeText(scriptText).then(() => {
      alert('Script copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy script. Please select and copy manually.');
    });
  }