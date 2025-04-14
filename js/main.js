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
    // ... (keep the existing analyzeText function implementation)
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', function() {
  setupEventTracking();
  setupCustomCursor();
  setupScrollButton();
  setupTextAnalysis();
});