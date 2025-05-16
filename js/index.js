// DOM Elements
    const authModal = document.getElementById('auth-modal');
    const authTitle = document.getElementById('auth-title');
    const authForm = document.getElementById('auth-form');
    const authSubmit = document.getElementById('auth-submit');
    const authSwitch = document.getElementById('auth-switch');
    const authSwitchText = document.getElementById('auth-switch-text');
    const nameField = document.getElementById('name-field');
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    const logoutButton = document.getElementById('logout-button');
    const closeAuth = document.getElementById('close-auth');
    const userMenuButton = document.getElementById('user-menu-button');
    const username = document.getElementById('username');
    const welcomeScreen = document.getElementById('welcome-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const marketChart = document.getElementById('market-chart');
    const watchlistContainer = document.getElementById('watchlist');
    const recentTradesContainer = document.getElementById('recent-trades');
    const marketDataContainer = document.getElementById('market-data');
    const currentPriceElement = document.getElementById('current-price');
    const priceChangeElement = document.getElementById('price-change');
    const tradingAssetSelect = document.getElementById('trading-asset');
    const marketOrderButton = document.getElementById('market-order');
    const limitOrderButton = document.getElementById('limit-order');
    const limitPriceContainer = document.getElementById('limit-price-container');
    const buyButton = document.getElementById('buy-button');
    const sellButton = document.getElementById('sell-button');
    const timeframeButtons = document.querySelectorAll('.market-timeframe');
    const heroSignupButton = document.getElementById('hero-signup-button');
    const ctaSignupButton = document.getElementById('cta-signup-button');
    const animatedPrice = document.getElementById('animated-price');
    const cursorBlink = document.getElementById('cursor-blink');

    // State
    let isLoggedIn = false;
    let isSignUp = false;
    let currentAsset = 'BTC/USD';
    let currentTimeframe = '1d';
    let marketData = {};
    let chart = null;
    let priceUpdateInterval = null;

    // Mock user data
    const users = [
      { email: 'demo@webre.com', password: 'password', name: 'Demo User' }
    ];

    // Mock market data
    const mockMarketData = {
      'BTC/USD': { price: 65432.10, change: 2.45, volume: '5.2B', marketCap: '1.2T' },
      'ETH/USD': { price: 3456.78, change: 1.23, volume: '2.1B', marketCap: '420B' },
      'XRP/USD': { price: 0.5678, change: -0.89, volume: '890M', marketCap: '28B' },
      'SOL/USD': { price: 123.45, change: 5.67, volume: '1.5B', marketCap: '45B' },
      'EUR/USD': { price: 1.0876, change: -0.12, volume: '98B', marketCap: 'N/A' },
      'GBP/USD': { price: 1.2654, change: 0.34, volume: '45B', marketCap: 'N/A' }
    };

    // Mock watchlist
    const mockWatchlist = [
      { symbol: 'BTC/USD', price: 65432.10, change: 2.45 },
      { symbol: 'ETH/USD', price: 3456.78, change: 1.23 },
      { symbol: 'SOL/USD', price: 123.45, change: 5.67 },
      { symbol: 'EUR/USD', price: 1.0876, change: -0.12 }
    ];

    // Mock recent trades
    const mockRecentTrades = [
      { symbol: 'BTC/USD', type: 'Buy', amount: 0.05, price: 64500.00, time: '10:30 AM' },
      { symbol: 'ETH/USD', type: 'Sell', amount: 1.2, price: 3450.25, time: '09:45 AM' },
      { symbol: 'SOL/USD', type: 'Buy', amount: 10, price: 122.50, time: 'Yesterday' },
      { symbol: 'EUR/USD', type: 'Sell', amount: 5000, price: 1.0880, time: 'Yesterday' }
    ];

    // Mock chart data
    function generateChartData(timeframe) {
      const data = [];
      const labels = [];
      let points = 0;
      let startPrice = 0;
      
      switch(timeframe) {
        case '1d':
          points = 24;
          startPrice = mockMarketData[currentAsset].price * 0.98;
          for (let i = 0; i < points; i++) {
            labels.push(`${i}:00`);
          }
          break;
        case '1w':
          points = 7;
          startPrice = mockMarketData[currentAsset].price * 0.95;
          for (let i = 0; i < points; i++) {
            labels.push(`Day ${i+1}`);
          }
          break;
        case '1m':
          points = 30;
          startPrice = mockMarketData[currentAsset].price * 0.9;
          for (let i = 0; i < points; i++) {
            labels.push(`Day ${i+1}`);
          }
          break;
        case '1y':
          points = 12;
          startPrice = mockMarketData[currentAsset].price * 0.7;
          for (let i = 0; i < points; i++) {
            labels.push(`Month ${i+1}`);
          }
          break;
      }
      
      let currentPrice = startPrice;
      for (let i = 0; i < points; i++) {
        // Random price movement
        const change = (Math.random() - 0.3) * 0.02 * currentPrice;
        currentPrice += change;
        data.push(currentPrice);
      }
      
      // Ensure the last point matches the current price
      data[data.length - 1] = mockMarketData[currentAsset].price;
      
      return { data, labels };
    }

    // Initialize Chart
    function initChart() {
      const ctx = marketChart.getContext('2d');
      const chartData = generateChartData(currentTimeframe);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
      gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
      
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: currentAsset,
            data: chartData.data,
            borderColor: '#0ea5e9',
            backgroundColor: gradient,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#0ea5e9',
            pointHoverBorderColor: '#fff',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#1e293b',
              titleColor: '#fff',
              bodyColor: '#e0f2fe',
              borderColor: '#475569',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `$${context.parsed.y.toFixed(2)}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                color: '#94a3b8'
              }
            },
            y: {
              grid: {
                color: '#334155',
                drawBorder: false
              },
              ticks: {
                color: '#94a3b8',
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          }
        }
      });
    }

    // Update Chart
    function updateChart() {
      const chartData = generateChartData(currentTimeframe);
      
      chart.data.labels = chartData.labels;
      chart.data.datasets[0].data = chartData.data;
      chart.data.datasets[0].label = currentAsset;
      chart.update();
    }

    // Render Watchlist
    function renderWatchlist() {
      watchlistContainer.innerHTML = '';
      
      mockWatchlist.forEach(item => {
        const changeClass = item.change >= 0 ? 'text-green-500' : 'text-red-500';
        const changeSign = item.change >= 0 ? '+' : '';
        
        const watchlistItem = document.createElement('div');
        watchlistItem.className = 'flex justify-between items-center p-3 bg-dark-900 rounded-md';
        watchlistItem.innerHTML = `
          <div>
            <div class="font-medium">${item.symbol}</div>
          </div>
          <div class="text-right">
            <div class="font-bold">$${item.price.toLocaleString()}</div>
            <div class="${changeClass} text-sm">${changeSign}${item.change}%</div>
          </div>
        `;
        watchlistContainer.appendChild(watchlistItem);
      });
    }

    // Render Recent Trades
    function renderRecentTrades() {
      recentTradesContainer.innerHTML = '';
      
      mockRecentTrades.forEach(trade => {
        const typeClass = trade.type === 'Buy' ? 'text-green-500' : 'text-red-500';
        
        const tradeItem = document.createElement('div');
        tradeItem.className = 'flex justify-between items-center p-3 bg-dark-900 rounded-md';
        tradeItem.innerHTML = `
          <div>
            <div class="font-medium">${trade.symbol}</div>
            <div class="text-sm text-gray-400">${trade.time}</div>
          </div>
          <div class="text-right">
            <div class="${typeClass} font-medium">${trade.type} ${trade.amount}</div>
            <div class="text-sm">$${trade.price.toLocaleString()}</div>
          </div>
        `;
        recentTradesContainer.appendChild(tradeItem);
      });
    }

    // Render Market Data
    function renderMarketData() {
      marketDataContainer.innerHTML = '';
      
      Object.entries(mockMarketData).forEach(([symbol, data]) => {
        const changeClass = data.change >= 0 ? 'text-green-500' : 'text-red-500';
        const changeSign = data.change >= 0 ? '+' : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-medium">${symbol}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            $${data.price.toLocaleString()}
          </td>
          <td class="px-6 py-4 whitespace-nowrap ${changeClass}">
            ${changeSign}${data.change}%
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            $${data.volume}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            ${data.marketCap}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button class="px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded-md text-sm trade-button" data-symbol="${symbol}">Trade</button>
          </td>
        `;
        marketDataContainer.appendChild(row);
      });
      
      // Add event listeners to trade buttons
      document.querySelectorAll('.trade-button').forEach(button => {
        button.addEventListener('click', () => {
          const symbol = button.getAttribute('data-symbol');
          tradingAssetSelect.value = symbol;
          updateCurrentAssetPrice();
          
          // Scroll to trading section
          document.querySelector('h2:contains("Trading")').scrollIntoView({ behavior: 'smooth' });
        });
      });
    }

    // Update Current Asset Price
    function updateCurrentAssetPrice() {
      currentAsset = tradingAssetSelect.value;
      const assetData = mockMarketData[currentAsset];
      
      currentPriceElement.textContent = `$${assetData.price.toLocaleString()}`;
      
      const changeClass = assetData.change >= 0 ? 'text-green-500' : 'text-red-500';
      const changeSign = assetData.change >= 0 ? '+' : '';
      priceChangeElement.textContent = `${changeSign}${assetData.change}%`;
      priceChangeElement.className = `text-lg font-medium ${changeClass}`;
    }

    // Simulate price updates
    function startPriceUpdates() {
      if (priceUpdateInterval) clearInterval(priceUpdateInterval);
      
      priceUpdateInterval = setInterval(() => {
        // Update prices with small random changes
        Object.keys(mockMarketData).forEach(symbol => {
          const data = mockMarketData[symbol];
          const change = (Math.random() - 0.45) * 0.005 * data.price;
          data.price += change;
          
          // Update 24h change occasionally
          if (Math.random() > 0.8) {
            data.change += (Math.random() - 0.5) * 0.2;
          }
        });
        
        // Update UI if current asset price changed
        if (isLoggedIn) {
          updateCurrentAssetPrice();
          renderWatchlist();
          renderMarketData();
        }
        
        // Update animated price in hero section
        if (!isLoggedIn) {
          const btcData = mockMarketData['BTC/USD'];
          animatedPrice.textContent = `$${btcData.price.toLocaleString()}`;
        }
      }, 5000);
    }

    // Animate trading interface cursor
    function animateCursor() {
      let visible = false;
      setInterval(() => {
        visible = !visible;
        cursorBlink.style.opacity = visible ? '0.7' : '0';
      }, 500);
      
      // Move cursor around randomly
      setInterval(() => {
        const top = 80 + Math.random() * 80;
        const right = 40 + Math.random() * 80;
        cursorBlink.style.top = `${top}px`;
        cursorBlink.style.right = `${right}px`;
      }, 3000);
    }

    // Authentication
    function showAuthModal(isSignUpMode = false) {
      isSignUp = isSignUpMode;
      
      if (isSignUp) {
        authTitle.textContent = 'Sign Up';
        authSubmit.textContent = 'Sign Up';
        nameField.classList.remove('hidden');
        authSwitchText.textContent = 'Already have an account?';
        authSwitch.textContent = 'Sign In';
      } else {
        authTitle.textContent = 'Sign In';
        authSubmit.textContent = 'Sign In';
        nameField.classList.add('hidden');
        authSwitchText.textContent = 'Don\'t have an account?';
        authSwitch.textContent = 'Sign Up';
      }
      
      authModal.classList.remove('hidden');
    }

    function hideAuthModal() {
      authModal.classList.add('hidden');
      authForm.reset();
    }

    function login(email, password) {
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        isLoggedIn = true;
        username.textContent = user.name;
        loginButton.classList.add('hidden');
        signupButton.classList.add('hidden');
        userMenuButton.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        welcomeScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
        
        // Initialize dashboard
        initChart();
        renderWatchlist();
        renderRecentTrades();
        renderMarketData();
        updateCurrentAssetPrice();
        startPriceUpdates();
        
        hideAuthModal();
        return true;
      }
      
      return false;
    }

    function signup(name, email, password) {
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return false;
      }
      
      // Add new user
      users.push({ email, password, name });
      
      // Auto login
      return login(email, password);
    }

    function logout() {
      isLoggedIn = false;
      loginButton.classList.remove('hidden');
      signupButton.classList.remove('hidden');
      userMenuButton.classList.add('hidden');
      logoutButton.classList.add('hidden');
      welcomeScreen.classList.remove('hidden');
      dashboardScreen.classList.add('hidden');
      
      // Clear intervals
      if (priceUpdateInterval) clearInterval(priceUpdateInterval);
      
      // Destroy chart
      if (chart) {
        chart.destroy();
        chart = null;
      }
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
      // Auth modal events
      loginButton.addEventListener('click', () => showAuthModal(false));
      signupButton.addEventListener('click', () => showAuthModal(true));
      closeAuth.addEventListener('click', hideAuthModal);
      authSwitch.addEventListener('click', () => showAuthModal(!isSignUp));
      
      // Hero and CTA signup buttons
      if (heroSignupButton) {
        heroSignupButton.addEventListener('click', () => showAuthModal(true));
      }
      
      if (ctaSignupButton) {
        ctaSignupButton.addEventListener('click', () => showAuthModal(true));
      }
      
      // Auth form submission
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (isSignUp) {
          const name = document.getElementById('name').value;
          if (!signup(name, email, password)) {
            alert('Email already in use or invalid credentials');
          }
        } else {
          if (!login(email, password)) {
            alert('Invalid email or password');
          }
        }
      });
      
      // Logout
      logoutButton.addEventListener('click', logout);
      
      // Trading interface events
      tradingAssetSelect.addEventListener('change', () => {
        updateCurrentAssetPrice();
      });
      
      marketOrderButton.addEventListener('click', () => {
        marketOrderButton.classList.add('active');
        limitOrderButton.classList.remove('active');
        limitPriceContainer.classList.add('hidden');
      });
      
      limitOrderButton.addEventListener('click', () => {
        limitOrderButton.classList.add('active');
        marketOrderButton.classList.remove('active');
        limitPriceContainer.classList.remove('hidden');
      });
      
      buyButton.addEventListener('click', () => {
        const amount = document.getElementById('trading-amount').value;
        if (!amount || isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          return;
        }
        
        alert(`Buy order placed for ${amount} ${currentAsset}`);
        
        // Add to recent trades
        mockRecentTrades.unshift({
          symbol: currentAsset,
          type: 'Buy',
          amount: parseFloat(amount),
          price: mockMarketData[currentAsset].price,
          time: 'Just now'
        });
        
        // Keep only the most recent 4 trades
        if (mockRecentTrades.length > 4) {
          mockRecentTrades.pop();
        }
        
        renderRecentTrades();
        document.getElementById('trading-amount').value = '';
      });
      
      sellButton.addEventListener('click', () => {
        const amount = document.getElementById('trading-amount').value;
        if (!amount || isNaN(amount) || amount <= 0) {
          alert('Please enter a valid amount');
          return;
        }
        
        alert(`Sell order placed for ${amount} ${currentAsset}`);
        
        // Add to recent trades
        mockRecentTrades.unshift({
          symbol: currentAsset,
          type: 'Sell',
          amount: parseFloat(amount),
          price: mockMarketData[currentAsset].price,
          time: 'Just now'
        });
        
        // Keep only the most recent 4 trades
        if (mockRecentTrades.length > 4) {
          mockRecentTrades.pop();
        }
        
        renderRecentTrades();
        document.getElementById('trading-amount').value = '';
      });
      
      // Chart timeframe buttons
      timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
          timeframeButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          
          currentTimeframe = button.getAttribute('data-timeframe');
          if (chart) {
            updateChart();
          }
        });
      });
      
      // Start animations for welcome screen
      animateCursor();
      startPriceUpdates();
      
      // For demo purposes, auto-login with demo account
      document.getElementById('email').value = 'demo@webre.com';
      document.getElementById('password').value = 'password';
    });

    // Helper for querySelector with :contains
    // This is needed for the trade button functionality
    Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
    Element.prototype.closest = Element.prototype.closest || function (selector) {
      let el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(selector)) return el;
        el = el.parentElement;
      } while (el !== null);
      return null;
    };

    // Add :contains selector
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function(s) {
        var el = this;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }

    // Add :contains pseudo
    document.querySelector = (function(_querySelector) {
      return function(selector) {
        if (selector.includes(':contains')) {
          const [tagName, text] = selector.split(':contains');
          const elements = document.querySelectorAll(tagName || '*');
          const textContent = text.replace(/['"()]/g, '');
          
          for (let i = 0; i < elements.length; i++) {
            if (elements[i].textContent.includes(textContent)) {
              return elements[i];
            }
          }
          
          return null;
        }
        
        return _querySelector.call(document, selector);
      };
    })(document.querySelector);