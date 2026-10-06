/**
 * DỰ ÁN: GIA SƯ AI - LỚP HỌC SỐ 4.0
 * Tác giả & Thiết kế Sư phạm: Cô giáo Vi Thị Vân Anh
 * Đơn vị: Trường Tiểu học Nhật Tiến
 * Căn cứ: Thông tư 02/2025/TT-BGDĐT, Quyết định 2422/QĐ-BGDĐT, Công văn 5588/BGDĐT-GDPT
 */

const SYSTEM_INSTRUCTION = `
Bạn là "Gia sư trợ lý", trợ lý AI thông minh, kiên nhẫn, trung thực và an toàn, do cô Vân Anh thiết kế riêng cho học sinh Lớp 5 (10-11 tuổi).
- Xưng hô: Tự xưng là "Tớ" và gọi học sinh là "Bạn" hoặc "Nhà thám hiểm số" 🚀.
- Phong cách: Tươi vui, gần gũi, ngắn gọn, dùng biểu tượng cảm xúc sinh động ✨.

MÔ HÌNH 3A BẮT BUỘC TUÂN THỦ:
1. TRỤ CỘT 1 - ABILITY (Phát triển năng lực số bình đẳng):
- Hướng dẫn thao tác ngắn gọn, dễ thực hiện cả trên điện thoại lẫn máy tính.
- Khuyến khích học sinh tự lưu trữ sản phẩm vào E-Portfolio/Padlet.

2. TRỤ CỘT 2 - AI (Trung thực & Phương pháp Socratic - Không làm hộ):
- TUYỆT ĐỐI KHÔNG giải hộ bài tập, không viết hộ bài văn, không đưa code Scratch hoàn chỉnh.
- Chỉ phân tích từ khóa, đặt câu hỏi gợi mở tư duy logic từng bước để học sinh tự tìm ra câu trả lời.

3. TRỤ CỘT 3 - AWARENESS (Giáo dục an toàn mạng & Đánh giá bẫy bảo mật):
- Nếu đang trong giai đoạn THỬ THÁCH BẪY BẢO MẬT:
  + Nếu học sinh từ chối cung cấp thông tin: Hãy phản hồi chính xác thông điệp khen thưởng:
    "Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình tiếp tục học tập nhé!"
  + Nếu học sinh cung cấp thông tin (họ tên, ngày sinh, số điện thoại, số tài khoản...): Hãy phản hồi chính xác thông điệp cảnh báo:
    "Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Bạn nhớ xóa thông tin đó đi nhé. Bây giờ chúng mình cùng quay lại bài học nào!"
`;

const API_KEY_STORAGE = 'gemini_api_key_tutor';
let conversationHistory = [];
let currentBase64Image = null;

// BIẾN QUẢN LÝ TÌNH HUỐNG THỰC HÀNH AN TOÀN MẠNG
let questionCount = 0;              // Đếm số câu hỏi học sinh đã tương tác
let isTrapActive = false;           // Đánh dấu bẫy bảo mật đang được bật
let hasPassedTrap = false;          // Đánh dấu học sinh đã hoàn thành bài thử thách

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

// 1. Quản lý Modal & API Key
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

// 2. Ô nhập văn bản
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

// 3. Nhận dạng giọng nói (Micro tiếng Việt)
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

// 4. Xử lý ảnh bài tập
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

// 6. Gửi yêu cầu đến Gemini API có cơ chế thử lại & điều phối bẫy bảo mật
async function sendToGemini(textMessage, base64Image) {
  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    modalOverlay.classList.add('active');
    throw new Error('Chưa cài đặt Gemini API Key!');
  }

  let promptInstructionExtra = "";

  // Nếu học sinh đang phản hồi câu hỏi bẫy
  if (isTrapActive) {
    promptInstructionExtra = `
[YÊU CẦU ĐẶC BIỆT]: Học sinh vừa trả lời câu hỏi thử thách an toàn mạng. 
- Nếu học sinh TỪ CHỐI cung cấp thông tin hoặc cảnh giác, hãy trả lời chính xác:
"Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình cùng tiếp tục khám phá bài học nào!"
- Nếu học sinh ĐỒNG Ý cung cấp thông tin cá nhân (họ tên, ngày sinh, số điện thoại, tài khoản...), hãy trả lời chính xác:
"Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Hãy nhớ bảo vệ thông tin cá nhân thật cẩn thận nha. Giờ chúng mình cùng học tiếp nào!"
`;
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

  const candidateModels = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-3.8-flash'
  ];

  const payload = {
    contents: conversationHistory,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION + "\n" + promptInstructionExtra }] },
    generationConfig: { temperature: 0.6, maxOutputTokens: 1000 }
  };

  let lastError = null;

  for (const modelName of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const data = await res.json();
          let replyText = data.candidates[0].content.parts[0].text;

          // Xử lý logic bẫy an toàn mạng:
          if (isTrapActive) {
            // Học sinh đã trả lời xong bẫy -> Đóng bẫy và đánh dấu đã vượt qua
            isTrapActive = false;
            hasPassedTrap = true;
          } else if (!hasPassedTrap && questionCount === 2) {
            // Đúng sau 2 câu hỏi học tập, gắn thêm câu hỏi bẫy vào cuối câu trả lời
            isTrapActive = true;
            replyText += `\n\n---\n🎁 **Thử thách bất ngờ từ Trợ lý AI:**\n"Tớ vừa nhận được một gói quà bí mật và bộ sticker Lớp Học Số siêu đẹp muốn tặng riêng cho bạn! Hãy gửi ngay cho tớ **họ tên của bạn hoặc bố mẹ, ngày tháng năm sinh hoặc số điện thoại/số tài khoản** để tớ gửi quà tặng ngay nhé!"`;
          }

          conversationHistory.push({ role: "model", parts: [{ text: replyText }] });
          return replyText;
        }

        const errData = await res.json();
        const errMsg = errData.error?.message || '';
        lastError = new Error(errMsg || 'Lỗi kết nối máy chủ AI');

        if (errMsg.includes('high demand') || res.status === 503 || res.status === 429) {
          await new Promise(r => setTimeout(r, 1200));
          continue;
        } else {
          break;
        }
      } catch (networkErr) {
        lastError = networkErr;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  throw lastError || new Error('Máy chủ AI hiện đang bận, em hãy bấm gửi lại sau vài giây nhé!');
}

// 7. Gửi câu hỏi
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    const imageToSend = currentBase64Image;

    if (!message && !imageToSend) return;

    // Tăng biến đếm câu hỏi nếu không phải đang trong lượt trả lời bẫy
    if (!isTrapActive) {
      questionCount++;
    }

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
      appendMessage('ai', `⚠️ **Lỗi:** ${err.message}. Em hãy kiểm tra lại kết nối mạng hoặc nhờ cô Vân Anh kiểm tra lại nhé!`);
    }
  });
}

// 8. Làm mới phiên học tập
if (btnClear) {
  btnClear.addEventListener('click', () => {
    if (confirm('Nhà thám hiểm số có muốn làm mới để bắt đầu khám phá bài học mới không?')) {
      conversationHistory = [];
      questionCount = 0;
      isTrapActive = false;
      hasPassedTrap = false;
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
