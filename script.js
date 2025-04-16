document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-fixed');
    } else {
      navbar.classList.remove('navbar-fixed');
    }
  }

  window.addEventListener('scroll', handleScroll);

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

  chatbotButton.addEventListener('click', function() {
    chatbotPanel.classList.toggle('hidden');
  });

  closeChatbot.addEventListener('click', function() {
    chatbotPanel.classList.add('hidden');
  });

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;

      addMessage('user', message);
      userInput.value = '';
      showTypingIndicator();

      try {
        const response = await getBotResponse(message);
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
        addMessage('assistant', response);
        scrollChatToBottom();
      } catch (error) {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) typingIndicator.remove();
        addMessage('assistant', 'Sorry, something went wrong. Please try again later.');
        scrollChatToBottom();
        console.error('Chatbot error:', error);
      }
    });
  }

  function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', role);
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = content; // Use textContent to preserve newlines with CSS
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    scrollChatToBottom();
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
    scrollChatToBottom();
  }

  function scrollChatToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function getBotResponse(message) {
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }
});
