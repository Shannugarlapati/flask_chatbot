document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeSwitch = document.getElementById('checkbox');
    const themeLabel = document.getElementById('theme-label');
    const body = document.body;
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const newChatButton = document.getElementById('newChatButton');
    const deleteChatButton = document.getElementById('deleteChatButton');
    const loadingIndicator = document.getElementById('loading');
    const confirmationDialog = document.getElementById('confirmationDialog');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    // State
    let conversationId = Date.now().toString();
    let messages = [];

    // Initialize Theme
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            body.classList.add('dark-mode');
            if (themeSwitch) themeSwitch.checked = true;
            if (themeLabel) themeLabel.textContent = 'Light Mode';
        } else if (themeLabel) {
            themeLabel.textContent = 'Dark Mode';
        }
    }

    // Initialize Chat
    function initChat() {
        addMessage('bot', "👋 Hello! I'm your AI assistant. How can I help you today?");
    }

    // Theme Toggle
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }

    // Message Functions
    function addMessage(sender, text) {
        const timestamp = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        messages.push({ sender, text, timestamp });
        renderMessages();
    }

    function renderMessages() {
        if (!chatContainer) return;
        
        chatContainer.innerHTML = '';
        
        // Create welcome message if it doesn't exist
        if (messages.length === 0) {
            addMessage('bot', "👋 Hello! I'm your AI assistant. How can I help you today?");
            return;
        }

        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}-message`;
            messageDiv.innerHTML = `
                <div class="avatar">
                    <i class="fas ${msg.sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
                </div>
                <div class="content">
                    <div class="message-text">${msg.text}</div>
                    <div class="timestamp">${msg.timestamp}</div>
                </div>
            `;
            chatContainer.appendChild(messageDiv);
        });
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Chat Actions
    function sendMessage() {
        if (!messageInput) return;
        
        const message = messageInput.value.trim();
        if (message === '') return;
        
        addMessage('user', message);
        messageInput.value = '';
        
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        
        // Simulate API call (replace with actual API call)
        setTimeout(() => {
            const responses = [
                "I understand what you're asking about.",
                "That's an interesting question!",
                "Let me think about that for a moment...",
                "Here's what I know about that topic.",
                "I can help with that!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            addMessage('bot', randomResponse);
            if (loadingIndicator) loadingIndicator.style.display = 'none';
        }, 800);
    }

    function startNewChat() {
        conversationId = Date.now().toString();
        messages = [];
        renderMessages();
    }

    function clearChat() {
        conversationId = Date.now().toString();
        messages = [];
        renderMessages();
        localStorage.setItem(`chatCleared_${conversationId}`, new Date().toISOString());
    }

    // Event Listeners
    if (themeSwitch) {
        themeSwitch.addEventListener('change', toggleTheme);
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }

    if (newChatButton) {
        newChatButton.addEventListener('click', startNewChat);
    }

    if (deleteChatButton) {
        deleteChatButton.addEventListener('click', () => {
            if (confirmationDialog) confirmationDialog.classList.add('active');
        });
    }

    if (cancelDelete) {
        cancelDelete.addEventListener('click', () => {
            if (confirmationDialog) confirmationDialog.classList.remove('active');
        });
    }

    if (confirmDelete) {
        confirmDelete.addEventListener('click', () => {
            clearChat();
            if (confirmationDialog) confirmationDialog.classList.remove('active');
        });
    }

    // Initialize
    initTheme();
    initChat();
});