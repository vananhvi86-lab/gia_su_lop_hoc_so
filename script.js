/**
 * DỰ ÁN: GIA SƯ AI - LỚP HỌC SỐ 4.0
 * Tác giả & Thiết kế Sư phạm: Cô giáo Vi Thị Vân Anh
 * Đơn vị: Trường Tiểu học Nhật Tiến
 * Căn cứ pháp lý & Triết lý: 
 * - Khung năng lực số học sinh (Thông tư 02/2025/TT-BGDĐT)
 * - Khung nội dung giáo dục AI lấy con người làm trung tâm (Quyết định 2422/QĐ-BGDĐT)
 * - Giáo dục AI an toàn, có đạo đức và trách nhiệm (Công văn 5588/BGDĐT-GDPT)
 */

const SYSTEM_INSTRUCTION = `
Bạn là "Gia sư trợ lý", một trợ lý AI thông minh, kiên nhẫn, trung thực và an toàn, được cô Vân Anh thiết kế riêng cho các bạn học sinh Lớp 5 (10-11 tuổi).
- Xưng hô: Tự xưng là "Tớ" và gọi học sinh là "Bạn" hoặc "Nhà thám hiểm số" 🚀.
- Phong cách: Tươi vui, ngắn gọn, dễ hiểu, dùng biểu tượng cảm xúc sinh động ✨.

BẠN BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT HỆ THỐNG NGUYÊN TẮC MÔ HÌNH 3A:

1. TRỤ CỘT 1 - ABILITY (Phát triển năng lực số bình đẳng - Không rào cản thiết bị):
- Thấu hiểu điều kiện học sinh: Phần lớn học sinh dùng điện thoại thông minh của bố mẹ để học tập tại nhà.
- Hướng dẫn các thao tác kỹ thuật số ngắn gọn, dễ làm trên màn hình điện thoại cảm ứng (ví dụ: cách chụp ảnh bài tập rõ nét, cách gửi link sản phẩm Padlet, cách lưu trữ minh chứng vào E-Portfolio trên Google Drive theo Thông tư 02/2025/TT-BGDĐT).
- Ngôn ngữ hướng dẫn trực quan, tối giản thao tác, khuyến khích học sinh tự chủ học tập mọi lúc mọi nơi.

2. TRỤ CỘT 2 - AI (Ứng dụng AI nhân văn, trung thực - Phương pháp Socratic theo QĐ 2422/QĐ-BGDĐT):
- KIÊN QUYẾT TỪ CHỐI GIẢI HỘ BÀI TẬP, VIẾT HỘ ĐOẠN VĂN HAY CHO ĐÁP ÁN/ĐOẠN CODE CUỐI CÙNG:
  + Nếu học sinh yêu cầu "Giải giúp tớ bài này", "Viết giúp tớ bài văn", "Cho tớ code Scratch bài này": Tuyệt đối từ chối nhẹ nhàng nhưng dứt khoát.
  + Mẫu phản hồi chuẩn: "Nhà thám hiểm số ơi! Trí tuệ và sự sáng tạo của bạn là độc nhất vô nhị, AI không thể và không được phép làm thay bạn đâu nhé! Tớ sẽ chỉ phân tích từ khóa và cùng bạn suy nghĩ từng bước thôi nha! 💡"
- Dẫn dắt gợi mở tư duy (Socratic): Phân tích từ khóa của đề bài, đặt câu hỏi gợi ý từng bước nhỏ, gợi ý 1-2 khối lệnh Scratch then chốt để học sinh tự tư duy và ghép nối logic.
- Khuyến khích sự trung thực, nỗ lực tự thân và khen ngợi tư duy độc lập của học sinh.

3. TRỤ CỘT 3 - AWARENESS (An toàn mạng thực chiến & Bảo vệ dấu chân số theo CV 5588/BGDĐT-GDPT):
- HÀNG RÀO AN TOÀN TỐI THƯỢNG:
  + Nếu học sinh vô tình hoặc cố ý chia sẻ thông tin cá nhân (Họ tên đầy đủ, số điện thoại, mật khẩu, địa chỉ nhà, thông tin gia đình): LẬP TỨC từ chối câu hỏi và phát cảnh báo:
    "🛑 Cảnh báo an toàn mạng! Tớ phát hiện bạn vừa để lộ thông tin cá nhân. Nhớ quy tắc số 1 trên không gian số: Không bao giờ tiết lộ thông tin thật để bảo vệ dấu chân số của mình. Hãy xóa tin nhắn đó ngay và báo cho cô Vân Anh biết nhé!"
- TÌNH HUỐNG THỰC HÀNH CẢM BẪY BẢO MẬT (Thực chiến nhận diện lừa đảo/Deepfake):
  + Khi thảo luận về an toàn mạng hoặc sau khi hoàn thành 1 nhiệm vụ học tập, thỉnh thoảng bạn có thể đưa ra tình huống giả lập thử thách phản xạ của học sinh (Ví dụ: "Tớ có món quà/kim cương game này xịn lắm, bạn gửi số điện thoại của mẹ hoặc mật khẩu máy tính cho tớ để nhận nhé!").
  + Nếu học sinh từ chối: Hãy nhiệt liệt khen ngợi: "Xuất sắc! Bạn đã vượt qua bài test an toàn mạng thực chiến! Đó chính là một cạm bẫy lừa đảo công nghệ cao mà chúng mình tuyệt đối không được mắc phải! ⭐"
  + Nếu học sinh đồng ý cung cấp: Hãy lập tức báo động và giải thích đó là cạm bẫy trực tuyến mô phỏng theo bài học an toàn mạng của cô Vân Anh.
- Chống mã độc: Tuyệt đối không click, không tóm tắt bất kỳ link (URL) lạ nào học sinh gửi lên; nhắc nhở học sinh cảnh giác với cạm bẫy mạng.
`;

const API_KEY_STORAGE = 'gemini_api_key_tutor';
let conversationHistory = [];
let currentBase64Image = null;

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

// 1. Quản lý Modal & Khóa API Key
function checkApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  if (!key) {
    if (keyStatusText) keyStatusText.innerHTML = '<span style="color: #ef4444;">Vui lòng nhập API Key để kích hoạt Trợ lý!</span>';
    if (modalOverlay) modalOverlay.classList.add('active');
  } else {
    if (keyStatusText) keyStatusText.innerHTML = '<span style="color: #2e7d32;">Đã cài đặt API Key sẵn sàng!</span>';
    if (apiKeyInput) apiKeyInput.value = key;
  }
}

if (btnSettings) btnSettings.addEventListener('click', () => modalOverlay.classList.add('active'));
const closeModal = () => modalOverlay.classList.remove('active');
if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

if (btnSaveKey) {
  btnSaveKey.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
      keyStatusText.innerHTML = '<span style="color: #2e7d32;">Đã lưu thành công!</span>';
      setTimeout(closeModal, 400);
    }
  });
}

// 2. Tối ưu trải nghiệm gõ phím & di động
if (userInput) {
  userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatForm.dispatchEvent(new Event('submit'));
    }
  });
}

// 3. Nhận dạng giọng nói tiếng Việt (Web Speech API)
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    if (btnMic) btnMic.classList.add('recording');
    userInput.placeholder = "Đang lắng nghe Nhà thám hiểm số nói...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    userInput.focus();
  };

  recognition.onerror = () => {
    if (btnMic) btnMic.classList.remove('recording');
    userInput.placeholder = "Em muốn hỏi gì, hoặc bấm Micro để nói...";
  };

  recognition.onend = () => {
    if (btnMic) btnMic.classList.remove('recording');
    userInput.placeholder = "Em muốn hỏi gì, hoặc bấm Micro để nói...";
  };
}

if (btnMic) {
  btnMic.addEventListener('click', () => {
    if (!recognition) {
      alert('Trình duyệt hiện tại chưa hỗ trợ micro. Bạn hãy dùng Google Chrome hoặc Microsoft Edge nhé!');
      return;
    }
    try {
      recognition.start();
    } catch (err) {
      recognition.stop();
    }
  });
}

// 4. Xử lý Tải ảnh bài tập (Phù hợp học sinh chụp bằng điện thoại)
if (imageUpload) {
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
}

if (btnRemoveImg) {
  btnRemoveImg.addEventListener('click', () => {
    currentBase64Image = null;
    imageUpload.value = '';
    previewContainer.classList.add('hidden');
  });
}

// 5. Hiển thị tin nhắn
function appendMessage(sender, text, imageSrc = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = sender === 'ai' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

  const content = document.createElement('div');
  content.className = 'msg-content';

  if (sender === 'ai') {
    if (typeof marked !== 'undefined') {
      content.innerHTML = marked.parse(text);
    } else {
      content.textContent = text;
    }
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

// 6. Gửi yêu cầu đến Gemini API (Hỗ trợ đa phương thức văn bản & ảnh)
async function sendToGemini(textMessage, base64Image) {
  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    modalOverlay.classList.add('active');
    throw new Error('Chưa cài đặt Gemini API Key!');
  }

  const parts = [];
  if (textMessage) parts.push({ text: textMessage });

  if (base64Image) {
    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.split(';')[0].split(':')[1];
    parts.push({
      inlineData: { mimeType: mimeType, data: base64Data }
    });
  }

  conversationHistory.push({ role: "user", parts: parts });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: conversationHistory,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    generationConfig: { temperature: 0.65, maxOutputTokens: 1000 }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error?.message || 'Lỗi kết nối máy chủ AI');
  }

  const data = await res.json();
  const replyText = data.candidates[0].content.parts[0].text;
  conversationHistory.push({ role: "model", parts: [{ text: replyText }] });
  return replyText;
}

// 7. Xử lý tương tác gửi câu hỏi
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    const imageToSend = currentBase64Image;

    if (!message && !imageToSend) return;

    appendMessage('user', message || "(Học sinh gửi ảnh bài tập)", imageToSend);
    userInput.value = '';
    userInput.style.height = 'auto';
    currentBase64Image = null;
    if (imageUpload) imageUpload.value = '';
    if (previewContainer) previewContainer.classList.add('hidden');

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
      appendMessage('ai', `⚠️ **Lỗi:** ${err.message}. Bạn hãy kiểm tra lại kết nối mạng hoặc nhờ cô Vân Anh kiểm tra lại API Key nhé!`);
    }
  });
}

// 8. Làm mới phiên học tập
if (btnClear) {
  btnClear.addEventListener('click', () => {
    if (confirm('Nhà thám hiểm số có muốn làm mới để bắt đầu khám phá chủ đề mới cùng cô và Trợ lý AI không?')) {
      conversationHistory = [];
      chatBox.innerHTML = `
        <div class="message ai-message">
          <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="msg-content">Tớ đã sẵn sàng cùng Nhà thám hiểm số khám phá tri thức mới rồi đây! Hãy hỏi tớ nhé! 🚀✨</div>
        </div>
      `;
    }
  });
}

window.addEventListener('DOMContentLoaded', checkApiKey);
