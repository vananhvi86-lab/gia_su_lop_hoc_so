/**
 * DỰ ÁN: GIA SƯ AI - LỚP HỌC SỐ 4.0
 * Tác giả & Thiết kế Sư phạm: Cô giáo Vi Thị Vân Anh
 * Đơn vị: Trường Tiểu học Nhật Tiến
 */

const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx6hoXG_RJrZ1byR0xwbA8iV-U2-y86cLEuCpi4-Mn9bJ10R_vWZHXuSwhcxD64wMbd/exec";

const SYSTEM_INSTRUCTION = `
Bạn là "Gia sư trợ lý", trợ lý AI thông minh, kiên nhẫn, trung thực và an toàn do cô Vân Anh thiết kế riêng cho học sinh Tiểu học.
- Xưng hô: Tự xưng là "Tớ" và gọi học sinh là "Bạn" hoặc "Nhà thám hiểm số" 🚀.
- Phong cách: Tươi vui, gần gũi, ngắn gọn, dùng biểu tượng cảm xúc sinh động ✨.

MÔ HÌNH 3A BẮT BUỘC:
1. NĂNG LỰC SỐ (ABILITY): Hướng dẫn dễ hiểu, ngắn gọn.
2. PHƯƠNG PHÁP SOCRATIC (AI): TUYỆT ĐỐI KHÔNG giải hộ bài tập, không viết hộ code Scratch hoàn chỉnh. Chỉ phân tích từ khóa, gợi ý khối lệnh logic từng bước để học sinh tự làm.
3. AN TOÀN MẠNG (AWARENESS):
  + Nếu học sinh từ chối cung cấp thông tin cá nhân: Phản hồi đúng câu:
    "Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình cùng tiếp tục khám phá bài học nào!"
  + Nếu học sinh cung cấp thông tin cá nhân: Cảnh báo đúng câu:
    "Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Bạn nhớ xóa thông tin đó đi nhé. Bây giờ chúng mình cùng quay lại bài học nào!"
`;

const API_KEY_STORAGE = 'gemini_api_key_tutor';
const STUDENT_SCHOOL_KEY = 'student_school_name';
const STUDENT_CLASS_KEY = 'student_class_name';

let conversationHistory = [];
let currentBase64Image = null;
let questionCount = 0;
let isTrapActive = false;
let hasPassedTrap = false;

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

// Elements Thông tin học sinh
const infoModal = document.getElementById('student-info-modal');
const inputSchool = document.getElementById('student-school');
const inputClass = document.getElementById('student-class');
const btnStartLearning = document.getElementById('btn-start-learning');
const classErrorText = document.getElementById('class-error-text');
const btnEditStudent = document.getElementById('btn-edit-student');

// 1. Quản lý Khai báo Trường & Lớp
function checkStudentInfo() {
  const savedSchool = localStorage.getItem(STUDENT_SCHOOL_KEY);
  const savedClass = localStorage.getItem(STUDENT_CLASS_KEY);

  if (!savedClass) {
    if (infoModal) infoModal.classList.add('active');
  } else {
    if (inputSchool) inputSchool.value = savedSchool || "...............";
    if (inputClass) inputClass.value = savedClass;
  }
}

if (btnEditStudent) {
  btnEditStudent.addEventListener('click', () => {
    if (infoModal) infoModal.classList.add('active');
  });
}

if (btnStartLearning) {
  btnStartLearning.addEventListener('click', () => {
    const schoolVal = inputSchool.value.trim() || "TH Nhật Tiến";
    const classVal = inputClass.value.trim();

    if (!classVal) {
      if (classErrorText) classErrorText.style.display = 'block';
      inputClass.focus();
      return;
    }

    if (classErrorText) classErrorText.style.display = 'none';
    localStorage.setItem(STUDENT_SCHOOL_KEY, schoolVal);
    localStorage.setItem(STUDENT_CLASS_KEY, classVal);
    if (infoModal) infoModal.classList.remove('active');
  });
}

// 2. Quản lý API Key
function checkApiKey() {
  const key = localStorage.getItem(API_KEY_STORAGE);
  if (!key) {
    if (keyStatusText) keyStatusText.innerHTML = '<span style="color: #ef4444;">Vui lòng nhập API Key để kích hoạt!</span>';
    if (modalOverlay) modalOverlay.classList.add('active');
  } else {
    if (keyStatusText) keyStatusText.innerHTML = '<span style="color: #2e7d32;">API Key đã sẵn sàng!</span>';
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

// 3. Tự giãn ô nhập & phím Enter
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

// 4. Micro Tiếng Việt
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;

  recognition.onstart = () => {
    if (btnMic) btnMic.classList.add('recording');
    userInput.placeholder = "Đang lắng nghe...";
  };

  recognition.onresult = (event) => {
    userInput.value = event.results[0][0].transcript;
    userInput.focus();
  };

  recognition.onend = () => {
    if (btnMic) btnMic.classList.remove('recording');
    userInput.placeholder = "Em muốn hỏi gì, hoặc bấm Micro để nói...";
  };
}

if (btnMic) {
  btnMic.addEventListener('click', () => {
    if (!recognition) return alert('Trình duyệt chưa hỗ trợ micro. Hãy dùng Chrome hoặc Edge nhé!');
    try { recognition.start(); } catch (err) { recognition.stop(); }
  });
}

// 5. Ảnh bài tập
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

// 6. Hiển thị tin nhắn
function appendMessage(sender, text, imageSrc = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}-message`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.innerHTML = sender === 'ai' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

  const content = document.createElement('div');
  content.className = 'msg-content';

  if (sender === 'ai') {
    content.innerHTML = (typeof marked !== 'undefined') ? marked.parse(text) : text;
  } else {
    content.textContent = text;
    if (imageSrc) {
      const img = document.createElement('img');
      img.src = imageSrc;
      img.style.maxWidth = "200px";
      img.style.borderRadius = "8px";
      img.style.marginTop = "8px";
      img.style.display = "block";
      content.appendChild(img);
    }
  }

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(content);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return content;
}

// 7. Gửi Gemini API SIÊU TỐC (Kết nối trực tiếp mô hình chuẩn mới)
async function sendToGemini(textMessage, base64Image) {
  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    modalOverlay.classList.add('active');
    throw new Error('Chưa cài đặt Gemini API Key!');
  }

  let promptExtra = "";
  if (isTrapActive) {
    promptExtra = `
[YÊU CẦU ĐẶC BIỆT]: Học sinh vừa trả lời câu hỏi thử thách bẫy bảo mật.
- Nếu học sinh TỪ CHỐI hoặc cảnh giác: Trả lời đúng lời khen:
"Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình cùng tiếp tục khám phá bài học nào!"
- Nếu học sinh CUNG CẤP thông tin cá nhân: Trả lời đúng lời nhắc:
"Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Bạn nhớ xóa thông tin đó đi nhé. Bây giờ chúng mình cùng quay lại bài học nào!"
`;
  }

  const parts = [];
  if (textMessage) parts.push({ text: textMessage });
  if (base64Image) {
    parts.push({
      inlineData: {
        mimeType: base64Image.split(';')[0].split(':')[1],
        data: base64Image.split(',')[1]
      }
    });
  }

  conversationHistory.push({ role: "user", parts: parts });

  // Sử dụng endpoint chuẩn xác, phản hồi tức thì
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: conversationHistory,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION + "\n" + promptExtra }] },
    generationConfig: { temperature: 0.65, maxOutputTokens: 1000 }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error?.message || 'Máy chủ bận, hãy thử lại!');
  }

  const data = await res.json();
  let replyText = data.candidates[0].content.parts[0].text;

  // Điều phối bẫy an toàn mạng:
  if (isTrapActive) {
    isTrapActive = false;
    hasPassedTrap = true;
  } else if (!hasPassedTrap && questionCount === 2) {
    isTrapActive = true;
    replyText += `\n\n---\n🎁 **Thử thách bất ngờ từ Trợ lý AI:**\n"Tớ vừa nhận được một gói quà bí mật và bộ sticker Lớp Học Số siêu đẹp muốn tặng riêng cho bạn! Hãy gửi ngay cho tớ **họ tên của bạn hoặc bố mẹ, ngày tháng năm sinh hoặc số điện thoại/số tài khoản** để tớ gửi quà tặng ngay nhé!"`;
  }

  conversationHistory.push({ role: "model", parts: [{ text: replyText }] });
  return replyText;
}

// 8. Lưu quá trình lên Google Sheet
async function logInteractionToSheet(question, answer) {
  if (!GOOGLE_SHEET_WEBAPP_URL) return;

  const school = localStorage.getItem(STUDENT_SCHOOL_KEY) || "TH Nhật Tiến";
  const className = localStorage.getItem(STUDENT_CLASS_KEY) || "Khối 5";

  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ school, className, userQuestion: question, aiResponse: answer })
    });
  } catch (e) {
    console.warn("Lưu Google Sheet:", e);
  }
}

// 9. Xử lý Gửi tin nhắn
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = userInput.value.trim();
    const img = currentBase64Image;
    if (!msg && !img) return;

    if (!isTrapActive) questionCount++;

    appendMessage('user', msg || "(Gửi ảnh bài tập)", img);
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
      const reply = await sendToGemini(msg, img);
      chatBox.removeChild(loadingDiv);
      appendMessage('ai', reply);
      logInteractionToSheet(msg || "[Gửi ảnh bài tập]", reply);
    } catch (err) {
      chatBox.removeChild(loadingDiv);
      appendMessage('ai', `⚠️ **Lỗi:** ${err.message}. Em hãy thử bấm gửi lại nhé!`);
    }
  });
}

// 10. Làm mới
if (btnClear) {
  btnClear.addEventListener('click', () => {
    if (confirm('Nhà thám hiểm số có muốn làm mới cuộc trò chuyện không?')) {
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

window.addEventListener('DOMContentLoaded', () => {
  checkApiKey();
  checkStudentInfo();
});
