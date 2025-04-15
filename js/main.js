// Track page visits and clicks
let clickCount = 0;
let visitCount = localStorage.getItem('visitCount') || 0;
visitCount++;
localStorage.setItem('visitCount', visitCount);

document.getElementById('visitCount').textContent = `Visits: ${visitCount}`;

// Enhanced Event Tracking System
function setupEventTracking() {
  // Track page load
  document.addEventListener('DOMContentLoaded', function() {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, view, page-load`);
    
    // Track initial visible elements
    trackVisibleElements();
  });

  // Track all clicks with detailed element information
  document.addEventListener('click', function(e) {
    // Ignore clicks on the custom cursor
    if (e.target.classList.contains('custom-cursor')) return;
    
    const target = e.target;
    const trackableElement = target.closest('.trackable');
    
    if (trackableElement) {
      clickCount++;
      document.getElementById('clickCount').textContent = `Clicks: ${clickCount}`;
      
      const timestamp = new Date().toISOString();
      let elementType = getDetailedElementType(target);
      
      console.log(`${timestamp}, click, ${elementType}`);
    }
  }, true);
  
  // Track element views using IntersectionObserver
  function trackVisibleElements() {
    const observer = new IntersectionObserver((entries) => {
      const timestamp = new Date().toISOString();
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let elementType = getDetailedElementType(entry.target);
          console.log(`${timestamp}, view, ${elementType}`);
        }
      });
    }, { threshold: 0.5 });

    // Observe all trackable elements and elements with IDs
    document.querySelectorAll('.trackable, [id]').forEach(el => {
      observer.observe(el);
    });
  }

  // Debounced scroll handler to track newly visible elements
  let lastScrollTime = 0;
  window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastScrollTime > 1000) {
      lastScrollTime = now;
      trackVisibleElements();
    }
  });

  // Helper function to get detailed element type
  function getDetailedElementType(element) {
    let elementType = element.tagName.toLowerCase();
    
    // Add class information if available
    if (element.classList.length > 0) {
      elementType += '.' + Array.from(element.classList).join('.');
    }
    
    // Add ID if available
    if (element.id) {
      elementType += '#' + element.id;
    }
    
    // Special handling for specific element types
    switch(element.tagName) {
      case 'A': 
        elementType = 'link' + (element.id ? '#' + element.id : '');
        break;
      case 'IMG': 
        elementType = 'image' + (element.id ? '#' + element.id : '');
        break;
      case 'BUTTON': 
        elementType = 'button' + (element.id ? '#' + element.id : '');
        break;
      case 'P': 
        elementType = 'paragraph' + (element.id ? '#' + element.id : '');
        break;
      case 'LI': 
        elementType = 'list-item' + (element.id ? '#' + element.id : '');
        break;
      case 'DIV': 
        elementType = 'container' + (element.id ? '#' + element.id : '');
        break;
      case 'SECTION': 
        elementType = 'section' + (element.id ? '#' + element.id : '');
        break;
    }
    
    return elementType;
  }
}

// Custom cursor implementation
function setupCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  
  // Make sure cursor element exists and is non-interactive
  if (cursor) {
    cursor.style.pointerEvents = 'none';
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.addEventListener('mousedown', () => {
      cursor.style.transform += ' scale(0.8)';
      cursor.style.backgroundColor = 'rgba(0, 191, 255, 0.5)';
    });

    document.addEventListener('mouseup', () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
      cursor.style.backgroundColor = 'rgba(0, 191, 255, 0.3)';
    });
  }
}

// Scroll to top button
function setupScrollButton() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  window.addEventListener('scroll', function() {
    scrollBtn.style.display = (window.scrollY > 100) ? "block" : "none";
  });

  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Text Analysis Functions
function setupTextAnalysis() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (!analyzeBtn) return;

  analyzeBtn.addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    analyzeText(text);
  });

  function analyzeText(text) {
    // Basic Statistics
    const letters = text.replace(/[^a-zA-Z]/g, "").length;
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const spaces = text.split(" ").length - 1;
    const newlines = text.split("\n").length - 1;
    const specialChars = text.replace(/[a-zA-Z0-9\s]/g, "").length;

    document.getElementById('basicStats').innerHTML = `
      <h4>Basic Statistics:</h4>
      <p>Letters: ${letters}</p>
      <p>Words: ${words}</p>
      <p>Spaces: ${spaces}</p>
      <p>Newlines: ${newlines}</p>
      <p>Special Characters: ${specialChars}</p>
    `;

    // Pronouns Analysis
    const pronouns = ['i', 'me', 'my', 'mine', 'myself', 
                     'you', 'your', 'yours', 'yourself', 
                     'he', 'him', 'his', 'himself', 
                     'she', 'her', 'hers', 'herself', 
                     'it', 'its', 'itself', 
                     'we', 'us', 'our', 'ours', 'ourselves', 
                     'they', 'them', 'their', 'theirs', 'themselves'];
    
    const pronounCounts = {};
    pronouns.forEach(pronoun => {
      const regex = new RegExp(`\\b${pronoun}\\b`, 'gi');
      const matches = text.match(regex);
      pronounCounts[pronoun] = matches ? matches.length : 0;
    });

    let pronounHTML = '<h4>Pronouns:</h4>';
    for (const [pronoun, count] of Object.entries(pronounCounts)) {
      if (count > 0) {
        pronounHTML += `<p>${pronoun}: ${count}</p>`;
      }
    }
    document.getElementById('pronounStats').innerHTML = pronounHTML;

    // Prepositions Analysis
    const prepositions = ['about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 
                         'at', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 
                         'by', 'down', 'during', 'for', 'from', 'in', 'inside', 'into', 'near', 'of', 
                         'off', 'on', 'out', 'over', 'through', 'to', 'toward', 'under', 'until', 'up', 
                         'upon', 'with', 'within', 'without'];
    
    const prepositionCounts = {};
    prepositions.forEach(preposition => {
      const regex = new RegExp(`\\b${preposition}\\b`, 'gi');
      const matches = text.match(regex);
      prepositionCounts[preposition] = matches ? matches.length : 0;
    });

    let prepositionHTML = '<h4>Prepositions:</h4>';
    for (const [preposition, count] of Object.entries(prepositionCounts)) {
      if (count > 0) {
        prepositionHTML += `<p>${preposition}: ${count}</p>`;
      }
    }
    document.getElementById('prepositionStats').innerHTML = prepositionHTML;

    // Articles Analysis
    const articles = ['a', 'an', 'the'];
    const articleCounts = {};
    articles.forEach(article => {
      const regex = new RegExp(`\\b${article}\\b`, 'gi');
      const matches = text.match(regex);
      articleCounts[article] = matches ? matches.length : 0;
    });

    let articleHTML = '<h4>Articles:</h4>';
    for (const [article, count] of Object.entries(articleCounts)) {
      if (count > 0) {
        articleHTML += `<p>${article}: ${count}</p>`;
      }
    }
    document.getElementById('articleStats').innerHTML = articleHTML;
  }
}

function setupRickRoll() {
  const rickRollItem = document.getElementById('rickroll-item');
  if (rickRollItem) {
    const link = rickRollItem.querySelector('a');
    if (link) {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
        window.open(this.href, '_blank'); // Still open the link in new tab
        
        // Change the text after a short delay
        setTimeout(() => {
          rickRollItem.innerHTML = 'Successfully Rick-Rolling an ISS TA';
          rickRollItem.style.color = '#00ff00';
          rickRollItem.style.fontWeight = 'bold';
        }, 500);
      });
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  setupEventTracking();
  setupCustomCursor();
  setupScrollButton();
  setupTextAnalysis();
  setupRickRoll();
});