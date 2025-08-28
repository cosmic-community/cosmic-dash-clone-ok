(function() {
  // Only activate when viewed in iframe (dashboard preview)
  if (window.self === window.top) return;
  
  const logs = [];
  const MAX_LOGS = 500;
  
  // Store original console methods
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug
  };
  
  // Helper to capture and send logs
  function captureLog(level, args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg, (key, value) => {
            if (typeof value === 'function') return '[Function]';
            if (value instanceof Error) return value.toString();
            return value;
          }, 2);
        } catch (e) {
          return '[Object]';
        }
      }
      return String(arg);
    }).join(' ');
    
    const logEntry = {
      timestamp,
      level,
      message,
      url: window.location.href
    };
    
    // Add to local storage with limit
    logs.push(logEntry);
    if (logs.length > MAX_LOGS) {
      logs.shift();
    }
    
    // Send to parent dashboard
    try {
      window.parent.postMessage({
        type: 'console-log',
        log: logEntry
      }, '*');
    } catch (e) {
      // Silent fail if postMessage fails
    }
  }
  
  // Override console methods
  console.log = function(...args) {
    originalConsole.log.apply(console, args);
    captureLog('log', args);
  };
  
  console.warn = function(...args) {
    originalConsole.warn.apply(console, args);
    captureLog('warn', args);
  };
  
  console.error = function(...args) {
    originalConsole.error.apply(console, args);
    captureLog('error', args);
  };
  
  console.info = function(...args) {
    originalConsole.info.apply(console, args);
    captureLog('info', args);
  };
  
  console.debug = function(...args) {
    originalConsole.debug.apply(console, args);
    captureLog('debug', args);
  };
  
  // Capture unhandled errors
  window.addEventListener('error', function(event) {
    captureLog('error', [`Unhandled Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`]);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    captureLog('error', [`Unhandled Promise Rejection: ${event.reason}`]);
  });
  
  // Send ready message to parent
  function sendReady() {
    try {
      window.parent.postMessage({
        type: 'console-capture-ready',
        url: window.location.href,
        timestamp: new Date().toISOString()
      }, '*');
      
      // Send initial route info after ready
      setTimeout(sendRouteChange, 100);
    } catch (e) {
      // Silent fail
    }
  }
  
  // Send route change message
  function sendRouteChange() {
    try {
      window.parent.postMessage({
        type: 'route-change',
        route: {
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          href: window.location.href
        },
        timestamp: new Date().toISOString()
      }, '*');
    } catch (e) {
      // Silent fail
    }
  }
  
  // Enhanced route change detection for SPAs
  let currentUrl = window.location.href;
  
  function detectUrlChange() {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;
      sendRouteChange();
    }
  }
  
  // Monitor route changes for SPAs - enhanced detection
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(detectUrlChange, 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(detectUrlChange, 0);
  };
  
  // Listen for various navigation events
  window.addEventListener('popstate', detectUrlChange);
  window.addEventListener('hashchange', detectUrlChange);
  
  // Poll for URL changes as fallback (for client-side routing that doesn't use history API)
  let urlCheckInterval;
  function startUrlMonitoring() {
    urlCheckInterval = setInterval(detectUrlChange, 1000);
  }
  
  function stopUrlMonitoring() {
    if (urlCheckInterval) {
      clearInterval(urlCheckInterval);
    }
  }
  
  // Enhanced detection for Next.js router events
  function setupNextJsDetection() {
    // Check for Next.js router
    if (window.next && window.next.router) {
      window.next.router.events.on('routeChangeComplete', sendRouteChange);
    }
    
    // Alternative: Listen for Next.js specific events
    window.addEventListener('beforeunload', stopUrlMonitoring);
    
    // Observe DOM changes that might indicate route changes
    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(function(mutations) {
        let hasSignificantChange = false;
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if significant content was added (like new page content)
            for (let node of mutation.addedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE && node.tagName && 
                  (node.tagName === 'MAIN' || node.tagName === 'SECTION' || 
                   node.className?.includes('page') || node.className?.includes('content'))) {
                hasSignificantChange = true;
                break;
              }
            }
          }
        });
        
        if (hasSignificantChange) {
          setTimeout(detectUrlChange, 100);
        }
      });
      
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
  }
  
  // Send ready message when loaded
  if (document.readyState === 'complete') {
    sendReady();
    startUrlMonitoring();
    setupNextJsDetection();
  } else {
    window.addEventListener('load', function() {
      sendReady();
      startUrlMonitoring();
      setupNextJsDetection();
    });
  }
  
  // Ensure we send initial route on DOM ready as well
  if (document.readyState !== 'loading') {
    setTimeout(sendRouteChange, 500);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(sendRouteChange, 500);
    });
  }
})();