function switchTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
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
  
    img.src = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(url);
  }
  
  function copyScript() {
    const scriptText = document.getElementById('appsScript').textContent;
    navigator.clipboard.writeText(scriptText).then(() => {
      alert('Script copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy script. Please select and copy manually.');
    });
  }
  
  function copyApiScript() {
    const scriptText = document.getElementById('apiScript').textContent;
    navigator.clipboard.writeText(scriptText).then(() => {
      alert('API script copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy script. Please select and copy manually.');
    });
  }
  
  let API_URL = null;
  
  function saveApiUrl() {
    const url = document.getElementById('apiUrl').value.trim();
    const statusDiv = document.getElementById('apiStatus');
    
    if (!url) {
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<div class="alert" style="background: #fee2e2; border-left: 4px solid #dc2626;">Please enter a valid Web App URL.</div>';
      return;
    }
    
    if (!url.includes('script.google.com') || !url.includes('/exec')) {
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<div class="alert" style="background: #fee2e2; border-left: 4px solid #dc2626;">Invalid URL format. Make sure you\'re using the Web App URL ending in /exec</div>';
      return;
    }
    
    API_URL = url;
    localStorage.setItem('itSupportApiUrl', url);
    
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<div class="alert" style="background: #d1fae5; border-left: 4px solid #16a34a;"><strong>Success!</strong> API URL saved. Go to the Dashboard tab to view your tickets.</div>';
    
    loadDashboardData();
  }
  
  function loadDashboardData() {
    if (!API_URL) {
      API_URL = localStorage.getItem('itSupportApiUrl');
    }
    
    if (!API_URL) {
      return;
    }
    
    const dashboardContent = document.getElementById('dashboardContent');
    const ticketGrid = document.getElementById('ticketGrid');
    
    dashboardContent.innerHTML = '<p style="color: var(--text-light);">Loading tickets...</p>';
    
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          dashboardContent.innerHTML = '<div class="alert alert-info"><strong>No tickets found.</strong><br />Submit a request through the Google Form to see tickets here.</div>';
          ticketGrid.style.display = 'none';
          return;
        }
        
        dashboardContent.style.display = 'none';
        ticketGrid.style.display = 'grid';
        ticketGrid.innerHTML = '';
        
        data.reverse().forEach(ticket => {
          const card = createTicketCard(ticket);
          ticketGrid.appendChild(card);
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        dashboardContent.innerHTML = '<div class="alert" style="background: #fee2e2; border-left: 4px solid #dc2626;"><strong>Failed to load data.</strong><br />Please check your API URL configuration and try again.</div>';
        ticketGrid.style.display = 'none';
      });
  }
  
  function createTicketCard(ticket) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    
    const typeClass = ticket.issueType.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const statusClass = `status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;
    
    const timestamp = new Date(ticket.timestamp);
    const timeString = timestamp.toLocaleString();
    
    card.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-type ${typeClass}">${ticket.issueType}</span>
        <span class="ticket-status ${statusClass}">${ticket.status}</span>
      </div>
      <div class="ticket-room">Room ${ticket.room}</div>
      <div class="ticket-issue">${ticket.issue}</div>
      <div class="ticket-meta">
        <div class="ticket-meta-item">
          <strong>From:</strong> ${ticket.email}
        </div>
        <div class="ticket-meta-item">
          <strong>Submitted:</strong> ${timeString}
        </div>
        ${ticket.websiteLink ? `
          <div class="ticket-meta-item">
            <strong>Website:</strong> <a href="${ticket.websiteLink}" target="_blank" style="color: var(--primary-color);">${ticket.websiteLink}</a>
          </div>
        ` : ''}
        ${ticket.timeNeeded ? `
          <div class="ticket-meta-item">
            <strong>Time Needed:</strong> ${ticket.timeNeeded}
          </div>
        ` : ''}
      </div>
    `;
    
    return card;
  }
  
  function refreshDashboard() {
    loadDashboardData();
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
  });