document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-fixed');
    } else {
      navbar.classList.remove('navbar-fixed');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Set initial state on page load

  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });

  const dropdownToggles = document.querySelectorAll('.mobile-menu .dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      const dropdown = this.parentElement;
      dropdown.classList.toggle('active');
      document.querySelectorAll('.mobile-menu .dropdown').forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const serviceCards = document.querySelectorAll('.service-card');
  function animateOnScroll() {
    serviceCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (cardTop < windowHeight * 0.75) {
        card.classList.add('animate-fade-in');
      }
    });
  }

  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll();

  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      setTimeout(() => {
        formMessage.textContent = 'Thank you for your message. We will get back to you soon!';
        formMessage.style.display = 'block';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        setTimeout(() => {
          formMessage.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  const chatbotButton = document.getElementById('chatbotButton');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const closeChatbot = document.getElementById('closeChatbot');
  const chatbotForm = document.getElementById('chatbotForm');
  const userInput = document.getElementById('userInput');
  const messagesContainer = document.getElementById('chatbotMessages');

  // Ensure chatbot is hidden initially
  if (chatbotPanel) {
    chatbotPanel.classList.add('hidden');
  }

  // Toggle chatbot and show welcome message
  if (chatbotButton) {
    chatbotButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Chatbot button clicked');
      if (chatbotPanel) {
        chatbotPanel.classList.remove('hidden');
        console.log('Chatbot panel shown');

        // Add welcome message if messages container is empty
        if (messagesContainer && messagesContainer.children.length === 0) {
          addMessage('assistant', 'Hello! I\'m the Gemba Indonesia virtual assistant. How can I help you today?');
        }
      } else {
        console.error('Chatbot panel not found');
      }
    });
  }

  // Close chatbot
  if (closeChatbot) {
    closeChatbot.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      chatbotPanel.classList.add('hidden');
    });
  }

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && chatbotPanel && !chatbotPanel.classList.contains('hidden')) {
      chatbotPanel.classList.add('hidden');
    }
  });

  // Prevent panel click from bubbling
  if (chatbotPanel) {
    chatbotPanel.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // Handle chat form submission
  if (chatbotForm) {
    chatbotForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;

      // Add user message
      addMessage('user', message);
      userInput.value = '';

      // Show typing indicator
      showTypingIndicator();

      try {
        const response = await getBotResponse(message);
        // Remove typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
        addMessage('assistant', response);
      } catch (error) {
        console.error('Chat error:', error);
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
          typingIndicator.remove();
        }
        addMessage('assistant', 'Sorry, something went wrong. Please try again later.');
      }
      scrollToBottom();
    });
  }

  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content;
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.classList.add('typing-dot');
      typingDiv.appendChild(dot);
    }
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Desktop hover logic for dropdown
  document.querySelectorAll('.dropdown').forEach(function(dropdown) {
    let hoverTimeout;

    dropdown.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      dropdown.classList.add('active');
    });

    dropdown.addEventListener('mouseleave', function() {
      hoverTimeout = setTimeout(function() {
        dropdown.classList.remove('active');
      }, 150); // Small delay for smoother UX
    });
  });
});

// Replace with your actual Netlify function URL!
const NETLIFY_CHAT_URL = 'https://gemba-website.netlify.app/.netlify/functions/chat';

async function getBotResponse(message) {
  try {
    console.log('Sending chat request:', message);
    const response = await fetch(NETLIFY_CHAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);
    if (data.error) {
      throw new Error(data.error);
    }
    // OpenAI's response is usually in data.choices[0].message.content
    return data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : 'Sorry, I could not understand the response.';
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Dropdown close logic for mobile and desktop
document.addEventListener('DOMContentLoaded', function() {
  // Handle all dropdowns
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    const dropdown = toggle.parentElement;

    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      // Close all other dropdowns
      document.querySelectorAll('.dropdown').forEach(function(d) {
        if (d !== dropdown) d.classList.remove('active');
      });
      // Toggle this one
      dropdown.classList.toggle('active');
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.dropdown').forEach(function(dropdown) {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });
});
