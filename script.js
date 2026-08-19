const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const settingsBtn = document.getElementById('settings-btn');
const apiModal = document.getElementById('api-modal');
const saveKeyBtn = document.getElementById('save-key-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const apiKeyInput = document.getElementById('api-key-input');

let apiKey = localStorage.getItem('openrouter_key') || '';
let conversationHistory = [];

if (apiKey) apiKeyInput.value = apiKey;

// Toggle Modal
settingsBtn.addEventListener('click', () => apiModal.classList.remove('hidden'));
closeModalBtn.addEventListener('click', () => apiModal.classList.add('hidden'));

// Save API Key
saveKeyBtn.addEventListener('click', () => {
  apiKey = apiKeyInput.value.trim();
  localStorage.setItem('openrouter_key', apiKey);
  apiModal.classList.add('hidden');
  appendMessage('System', 'API key saved successfully!');
});

// Submit Chat
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  if (!apiKey) {
    alert('Please click the ⚙️ Key button and enter your OpenRouter API key first.');
    apiModal.classList.remove('hidden');
    return;
  }

  appendMessage('user', message);
  userInput.value = '';
  
  // Loading indicator
  const loadingDiv = appendMessage('ai', 'Thinking...');

  conversationHistory.push({ role: 'user', content: message });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: conversationHistory
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const reply = data.choices[0].message.content;
      loadingDiv.textContent = reply;
      conversationHistory.push({ role: 'assistant', content: reply });
    } else {
      loadingDiv.textContent = 'Error: Unable to process response. Please check your API key.';
    }
  } catch (error) {
    loadingDiv.textContent = 'Error connecting to AI server. Please try again.';
  }
});

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}
