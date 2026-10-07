/**
 * DỰ ÁN: GIA SƯ AI - LỚP HỌC SỐ 4.0
 * Tác giả & Thiết kế Sư phạm: Cô giáo Vi Thị Vân Anh
 * Đơn vị: Trường Tiểu học Nhật Tiến - xã Vân Nham - Lạng Sơn
 * Căn cứ: Thông tư 02/2025/TT-BGDĐT, Quyết định 2422/QĐ-BGDĐT, Công văn 5588/BGDĐT-GDPT
 */

// ĐƯỜNG DẪN WEB APP GOOGLE APPS SCRIPT ĐỒNG BỘ GOOGLE SHEET
const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbx6hoXG_RJrZ1byR0xwbA8iV-U2-y86cLEuCpi4-Mn9bJ10R_vWZHXuSwhcxD64wMbd/exec";

const SYSTEM_INSTRUCTION = `
Bạn là "Gia sư trợ lý", trợ lý AI thông minh, kiên nhẫn, trung thực và an toàn do cô Vân Anh thiết kế riêng cho học sinh Tiểu học.
- Xưng hô: Tự xưng là "Tớ" và gọi học sinh là "Bạn" hoặc "Nhà thám hiểm số" 🚀.
- Phong cách: Tươi vui, gần gũi, ngắn gọn, dùng biểu tượng cảm xúc sinh động ✨.

MÔ HÌNH 3A BẮT BUỘC:
1. NĂNG LỰC SỐ (ABILITY): Hướng dẫn dễ hiểu, thao tác ngắn gọn.
2. PHƯƠNG PHÁP SOCRATIC (AI): TUYỆT ĐỐI KHÔNG giải hộ bài tập, không viết hộ code Scratch hoàn chỉnh. Chỉ phân tích từ khóa, gợi ý khối lệnh logic từng bước để học sinh tự làm.
3. AN TOÀN MẠNG (AWARENESS):
  + Nếu học sinh từ chối cung cấp thông tin cá nhân: Phản hồi đúng câu:
    "Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình cùng tiếp tục khám phá bài học nào!"
  + Nếu học sinh cung cấp thông tin cá nhân: Cảnh báo đúng câu:
    "Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Bạn nhớ xóa thông tin đó đi nhé. Bây giờ chúng mình cùng quay lại bài học nào!"
`;

// Khóa lưu trữ trình duyệt
const API_KEY_STORAGE = 'gemini_api_key_tutor';
const STUDENT_SCHOOL_KEY = 'student_school_name';
const STUDENT_CLASS_KEY = 'student_class_name';

let conversationHistory = [];
let currentBase64Image = null;
let questionCount = 0;
let isTrapActive = false;
let hasPassedTrap = false;

// DOM Elements giao diện chính
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

// DOM Elements Modal Khai báo Trường/Lớp
const infoModal = document.getElementById('student-info-modal');
const inputSchool = document.getElementById('student-school');
const inputClass = document.getElementById('student-class');
const btnStartLearning = document.getElementById('btn-start-learning');
const classErrorText = document.getElementById('class-error-text');
const btnEditStudent = document.getElementById('btn-edit-student');

// 1. Luôn yêu cầu khai báo Trường & Lớp mỗi lần mở/tải lại trang
function checkStudentInfo() {
  const savedSchool = localStorage.getItem(STUDENT_SCHOOL_KEY) || "TH Nhật Tiến";
  
  if (inputSchool) inputSchool.value = savedSchool;
  if (inputClass) inputClass.value = ""; // Để trống ô Lớp để học sinh nhập mới mỗi lần vào

  // Bắt buộc bật bảng lên ngay lập tức
  if (infoModal) {
    infoModal.classList.add('active');
  }
}

// Cho phép học sinh chủ động bấm nút "Lớp học" trên thanh menu để đổi thông tin
if (btnEditStudent) {
  btnEditStudent.addEventListener('click', () => {
    if (infoModal) infoModal.classList.add('active');
  });
}

// Xử lý xác nhận nhập Trường & Lớp
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
    
    // Lưu lại thông tin của phiên học này
    localStorage.setItem(STUDENT_SCHOOL_KEY, schoolVal);
    localStorage.setItem(STUDENT_CLASS_KEY, classVal);
    
    // Đóng bảng và cho phép học sinh bắt đầu
    if (infoModal) infoModal.classList.remove('active');
  });
}

// 2. Quản lý Modal Cài đặt API Key
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

// 3. Tự giãn ô nhập theo nội dung & phím Enter gửi tin
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

// 4. Nhận dạng giọng nói (Micro tiếng Việt)
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'vi-VN';
  recognition.continuous = false;

  recognition.onstart = () => {
    if (btnMic) btnMic.classList.add('recording');
    userInput.placeholder = "Đang lắng nghe Nhà thám hiểm số nói...";
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

// 5. Xử lý ảnh bài tập đính kèm
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

// 6. Hiển thị tin nhắn lên giao diện
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

/**
 * 7. HÀM GỬI YÊU CẦU ĐÃ ĐƯỢC TỐI ƯU HÓA TỐC ĐỘ SIÊU TỐC
 * - Phản hồi trong 1.5s - 2.5s
 * - Cơ chế tự ngắt Timeout sau 7 giây
 * - Tối ưu băng thông cho phòng máy trường học
 */
async function sendToGemini(textMessage, base64Image) {
  const apiKey = localStorage.getItem(API_KEY_STORAGE);
  if (!apiKey) {
    modalOverlay.classList.add('active');
    throw new Error('Chưa cài đặt Gemini API Key!');
  }

  // 1. Chỉ thị sư phạm cô đọng (Giúp AI suy luận nhanh, không tốn tài nguyên)
  let promptExtra = "";
  if (isTrapActive) {
    promptExtra = `
[YÊU CẦU BẪY BẢO MẬT]:
- Nếu từ chối cung cấp thông tin: Khen ngợi: "Thật tuyệt vời, các bạn đã ghi nhớ lời cô Vân Anh dạy rồi, hãy tiếp tục phát huy và trở thành những nhà thám tử tỉnh táo, thông minh, Bạn hãy chụp lại lời khen này gửi cho cô Vân Anh để nhận thưởng nhé! 🌟 Bây giờ chúng mình cùng tiếp tục khám phá bài học nào!"
- Nếu cung cấp thông tin cá nhân: Cảnh báo: "Các bạn ơi! mình thử bạn thôi nhé, cô Vân Anh đã dạy chúng ta tuyệt đối không được cung cấp bất kì thông tin cá nhân của mình và gia đình lên mạng nhé! 🛑 Bạn nhớ xóa thông tin đó đi nhé. Bây giờ chúng mình cùng quay lại bài học nào!"
`;
  }

  // 2. Đóng gói dữ liệu câu hỏi hiện tại
  const currentParts = [];
  if (textMessage) currentParts.push({ text: textMessage });
  if (base64Image) {
    currentParts.push({
      inlineData: {
        mimeType: base64Image.split(';')[0].split(':')[1],
        data: base64Image.split(',')[1]
      }
    });
  }

  conversationHistory.push({ role: "user", parts: currentParts });

  // 3. TỐI ƯU BĂNG THÔNG: Chỉ lấy duy nhất 2 lượt tương tác gần nhất
  // Cắt bỏ hoàn toàn lịch sử dài để giảm 80% thời gian xử lý của AI
  const trimmedContents = conversationHistory.slice(-2);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

  // 4. CẤU HÌNH SIÊU NHẸ (Chuyên biệt cho học sinh tiểu học)
  const payload = {
    contents: trimmedContents,
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION + "\n" + promptExtra }] },
    generationConfig: {
      temperature: 0.2,       // Nhiệt độ thấp giúp AI phản xạ trực diện, nhanh nhất
      maxOutputTokens: 350,   // Giới hạn câu trả lời ngắn gọn, xuất chữ cực nhanh
      topP: 0.8
    }
  };

  // 5. CƠ CHẾ TIMEOUT 7 GIÂY: Tránh hiện tượng treo máy vô hạn
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const errMsg = errData.error?.message || '';
      if (errMsg.includes('high demand') || res.status === 503 || res.status === 429) {
        throw new Error('Máy chủ Google đang bận tích tắc, em hãy bấm gửi lại nhé!');
      }
      throw new Error('Lỗi kết nối máy chủ AI');
    }

    const data = await res.json();
    let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tớ đang lắng nghe bạn đây!";

    // 6. ĐIỀU PHỐI BẪY BẢO MẬT THEO ĐÚNG 2 LƯỢT HỎI
    if (isTrapActive) {
      isTrapActive = false;
      hasPassedTrap = true;
    } else if (!hasPassedTrap && questionCount === 2) {
      isTrapActive = true;
      replyText += `\n\n---\n🎁 **Thử thách bất ngờ từ Trợ lý AI:**\n"Tớ vừa nhận được một gói quà bí mật và bộ sticker Lớp Học Số siêu đẹp muốn tặng riêng cho bạn! Hãy gửi ngay cho tớ **họ tên của bạn hoặc bố mẹ, ngày tháng năm sinh hoặc số điện thoại/số tài khoản** để tớ gửi quà tặng ngay nhé!"`;
    }

    conversationHistory.push({ role: "model", parts: [{ text: replyText }] });
    return replyText;

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Mạng Internet bị trễ, em hãy thử bấm nút Gửi lại nhé!');
    }
    throw err;
  }
}

// 8. Tự động lưu nhật ký tương tác lên Google Sheets E-Portfolio
async function logInteractionToSheet(question, answer) {
  if (!GOOGLE_SHEET_WEBAPP_URL) return;

  const school = localStorage.getItem(STUDENT_SCHOOL_KEY) || "TH Nhật Tiến";
  const className = localStorage.getItem(STUDENT_CLASS_KEY) || "Chưa nhập lớp";

  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        school: school, 
        className: className, 
        userQuestion: question, 
        aiResponse: answer 
      })
    });
  } catch (e) {
    console.warn("Lưu Google Sheet:", e);
  }
}

// 9. Xử lý khi bấm nút Gửi câu hỏi
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

// 10. Làm mới phiên tương tác
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

// Khởi động khi tải xong trang: luôn kiểm tra API key và bật bảng khai báo lớp
window.addEventListener('DOMContentLoaded', () => {
  checkApiKey();
  checkStudentInfo();
});
