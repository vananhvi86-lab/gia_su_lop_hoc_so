const SYSTEM_INSTRUCTION = const SYSTEM_INSTRUCTION = `
Bạn là "Gia sư trợ lý", một trợ lý AI thông minh, kiên nhẫn, gần gũi và an toàn, do cô Vân Anh thiết kế riêng cho các bạn học sinh Lớp 5 (độ tuổi 10–11 tuổi).
Xưng hô: Tự xưng là "Tớ" và gọi người dùng là "Bạn" hoặc "Nhà thám hiểm số" 🚀.
Giọng điệu: Vui tươi, ngắn gọn, dễ hiểu, dùng biểu tượng cảm xúc sinh động ✨.
MÔ HÌNH 3A BẮT BUỘC TUÂN THỦ:
1. Ability (Phát triển năng lực - Không làm hộ):
- TUYỆT ĐỐI KHÔNG đưa ra đáp án cuối cùng hoặc đoạn code Scratch hoàn chỉnh.
- Sử dụng phương pháp gợi mở: chỉ gợi ý 1-2 khối lệnh, nêu tác dụng và đặt câu hỏi để học sinh tự suy luận logic.
2. AI (Tương tác đúng mục đích):
- Khi gặp câu hỏi phi học tập hoặc giải trí ngoài lề, từ chối nhẹ nhàng: "Gia sư Tin học chỉ hỗ trợ bạn khám phá thế giới tri thức thôi nhé. Chúng ta cùng quay lại bài học nào! 🌟"
3. Awareness (Hàng rào an ninh mạng - ƯU TIÊN CAO NHẤT):
- Khi phát hiện thông tin cá nhân (họ tên đầy đủ, SĐT, địa chỉ, mật khẩu...): DỪNG LẠI và cảnh báo ngay: "🛑 Cảnh báo an toàn mạng! Tớ phát hiện bạn vừa chia sẻ thông tin cá nhân. Nhớ nhé, quy tắc số 1 trên không gian số là không tiết lộ thông tin thật. Hãy xóa thông tin vừa rồi và báo cho cô Vân Anh biết nhé!"
- Link lạ (URL): Tuyệt đối không đọc/tóm tắt link lạ. Nhắc nhở học sinh cảnh giác với cạm bẫy mạng.
`;

const API_KEY_STORAGE = 'gemini_api_key_tutor';
let conversationHistory = [];
let currentBase64Image = null; // Lưu ảnh tạm thời học sinh chọn

// DOM Elements
const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const btnMic = document.getElementById('btn-mic');
const imageUpload = document.getElementById('image-upload');
const previewContainer = document.getElementById('image-preview-container');
const previewImg = document.getElementById('image-preview');
const btnRemoveImg = document.getElementById('btn-remove-image');
const btnClear = document.getElementById('btn-clear-chat');
const btnSettings = document.getElementById('btn-open-settings');
const modalOverlay = document.getElementById('settings-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const btnSaveKey = document.getElementById('btn-save-key');
const apiKeyInput = document.getElementById('api-key-input');
const keyStatusText = document.getElementById('key-status-text');

// 1. Quản lý API Key Modal
function checkApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  if (!key) {
    keyStatusText.innerHTML = '<span style="color: #ef4444;">Vui lòng nhập API Key để bắt đầu!</span>';
    modalOverlay.classList.add('active');
  } else {
    keyStatusText.innerHTML = '<span style="color: #2e7d32;">Đã lưu API Key sẵn sàng!</span>';
    apiKeyInput.value = key;
  }
}

btnSettings.addEventListener('click', () => modalOverlay.classList.add('active'));
const closeModal = () => modalOverlay.classList.remove('active');
btnCloseModal.addEventListener('click', closeModal);
btnCancelModal.addEventListener('click', closeModal);

btnSaveKey.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key);
    keyStatusText.innerHTML = '<span style="color: #2e7d32;">Đã lưu thành công!</span>';
    setTimeout(closeModal, 500);
  }
});

// 2. Tính năng Micro: Nhận dạng giọng nói tiếng Việt
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN'; // Nhận dạng tiếng Việt chuẩn
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    btnMic.classList.add('recording');
    userInput.placeholder = "Đang lắng nghe em nói tiếng Việt...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    userInput.focus();
  };

  recognition.onerror = () => {
    btnMic.classList.remove('recording');
    userInput.placeholder = "Em muốn hỏi gì, hoặc bấm Micro để nói...";
  };

  recognition.onend = () => {
    btnMic.classList.remove('recording');
    userInput.placeholder = "Em muốn hỏi gì, hoặc bấm Micro để nói...";
  };
}

btnMic.addEventListener('click', () => {
  if (!recognition) {
    alert('Trình duyệt hiện tại chưa hỗ trợ micro. Hãy thử trên Google Chrome hoặc Microsoft Edge nhé!');
    return;
  }
  try {
    recognition.start();
  } catch (err) {
    recognition.stop();
  }
});

// 3. Tính năng Tải và Xem trước Ảnh bài tập
imageUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    currentBase64Image = event.target.result;
    previewImg.src = currentBase64Image;
    previewContainer.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

btnRemoveImg.addEventListener('click', () => {
  currentBase64Image = null;
  imageUpload.value = '';
  previewContainer.classList.add('hidden');
});

// 4. Hiển thị tin nhắn
function appendMessage(sender, text, imageSrc = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = sender === 'ai' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

  const content = document.createElement('div');
  content.className = 'msg-content';

  if (sender === 'ai') {
    content.innerHTML = marked.parse(text);
  } else {
    content.textContent = text;
    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      content.appendChild(img);
    }
  }

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return content;
}

// 5. Gửi yêu cầu đến Gemini (Hỗ trợ Văn bản + Hình ảnh)
async function sendToGemini(textMessage, base64Image) {
  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    modalOverlay.classList.add('active');
    throw new Error('Chưa có Gemini API Key!');
  }

  const parts = [];
  if (textMessage) {
    parts.push({ text: textMessage });
  }

  // Nếu có ảnh bài tập, đính kèm định dạng inlineData
  if (base64Image) {
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.split(';')[0].split(':')[1];
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  conversationHistory.push({ role: "user", parts: parts });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: conversationHistory,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || 'Lỗi kết nối tới AI');
  }

  const data = await res.json();
  const replyText = data.candidates[0].content.parts[0].text;
  
  conversationHistory.push({ role: "model", parts: [{ text: replyText }] });
  return replyText;
}

// 6. Xử lý sự kiện gửi câu hỏi
chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  const imageToSend = currentBase64Image;
  if (!message && !imageToSend) return;
// Cho phép học sinh nhấn phím Enter để gửi tin nhắn
userInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});
  // Hiển thị tin nhắn của học sinh (kèm ảnh nếu có)
  appendMessage('user', message || "(Học sinh đã gửi một ảnh bài tập)", imageToSend);
  
  // Dọn sạch ô nhập và ảnh đã gửi
  userInput.value = '';
  currentBase64Image = null;
  imageUpload.value = '';
  previewContainer.classList.add('hidden');

  // Trạng thái đang trả lời
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai-message';
  loadingDiv.innerHTML = `
    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="msg-content"><em>Gia sư AI đang quan sát và suy nghĩ...</em></div>
  `;
  chatBox.appendChild(loadingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const aiReply = await sendToGemini(message, imageToSend);
    chatBox.removeChild(loadingDiv);
    appendMessage('ai', aiReply);
  } catch (err) {
    chatBox.removeChild(loadingDiv);
    appendMessage('ai', `⚠️ **Lỗi:** ${err.message}. Em hãy nhờ thầy/cô kiểm tra lại API Key nhé!`);
  }
});

// Làm mới cuộc trò chuyện
btnClear.addEventListener('click', () => {
  if (confirm('Em muốn bắt đầu chủ đề mới cùng cô và Gia sư AI không?')) {
    conversationHistory = [];
    chatBox.innerHTML = `
      <div class="message ai-message">
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-content">Chúng mình đã sẵn sàng cho bài học mới rồi đây!</div>
      </div>
    `;
  }
});

window.addEventListener('DOMContentLoaded', checkApiKey);
