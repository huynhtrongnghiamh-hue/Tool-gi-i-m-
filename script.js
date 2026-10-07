/**
 * HIGH-LEVEL AUTOMATED LUA DEOBFUSCATOR ENGINE
 * Architecture: Emulated Sandbox & AST Clean Engine
 */

// ==========================================
// 1. UI & FILE HANDLERS
// ==========================================

function loadFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('rawCode').value = e.target.result;
        updateStatus(`Đã nạp file thành công: ${file.name} (${formatBytes(file.size)})`, 'success');
    };
    reader.onerror = function() {
        updateStatus("Lỗi nghiêm trọng khi đọc file!", "error");
    };
    reader.readAsText(file);
}

function updateStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusText');
    if (!statusEl) return;
    
    statusEl.innerText = message;
    if (type === 'error') statusEl.style.color = '#ff7b72';
    else if (type === 'success') statusEl.style.color = '#7ee787';
    else statusEl.style.color = '#8b949e';
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function downloadResult() {
    const code = document.getElementById('cleanCode').value;
    if (!code.trim()) {
        alert("Không có dữ liệu mã sạch để tải về!");
        return;
    }
    const blob = new Blob([code], { type: 'text/x-lua;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = "deobfuscated_high_level.lua";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ==========================================
// 2. HIGH-LEVEL DEOBFUSCATION CORE ENGINE
// ==========================================

// 2.1 Quét & Giải mã chuỗi đa tầng (Multi-layer String Decryptor)
function deepDecodeStrings(code) {
    // Giải mã Hex (\xXX)
    code = code.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    
    // Giải mã Decimal (\DDD)
    code = code.replace(/\\([0-9]{1,3})/g, (match, dec) => {
        const val = parseInt(dec, 10);
        return (val >= 32 && val <= 126) ? String.fromCharCode(val) : match;
    });

    // Giải mã chuỗi string.char(...)
    code = code.replace(/string\.char\(([\d\s,]+)\)/gi, (match, args) => {
        try {
            const bytes = args.split(',').map(n => parseInt(n.trim(), 10));
            if (bytes.every(b => b >= 32 && b <= 126)) {
                return `"${String.fromCharCode(...bytes)}"`;
            }
        } catch (e) {}
        return match;
    });

    // Giải mã mảng chuỗi nén: {"a","b","c"} -> "abc"
    code = code.replace(/\{\s*(?:["'][\x20-\x7E]["']\s*,\s*)+["'][\x20-\x7E]["']\s*\}/g, (match) => {
        try {
            const chars = match.match(/["']([\x20-\x7E])["']/g).map(c => c.slice(1, -1));
            return `"${chars.join('')}"`;
        } catch (e) { return match; }
    });

    return code;
}

// 2.2 Giả lập Sandbox tĩnh để giải mã hàm String Table (Emulated String Decryptor)
function emulateStringTable(code) {
    // Phát hiện hàm giải mã dạng: function decrypt(index) return table[index] end
    const tableRegex = /local\s+([a-zA-Z0-9_]+)\s*=\s*\{([^\}]+)\}/;
    const match = code.match(tableRegex);
    
    if (match) {
        const tableName = match[1];
        const rawItems = match[2].split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
        
        if (rawItems.length > 0) {
            // Thay thế trực tiếp các truy xuất mảng dạng tableName[1] thành giá trị thật
            rawItems.forEach((val, idx) => {
                const targetPattern = new RegExp(`\\b${tableName}\\[\\s*${idx + 1}\\s*\\]`, 'g');
                code = code.replace(targetPattern, `"${val}"`);
            });
        }
    }
    return code;
}

// 2.3 Phân tích & Tối ưu biểu thức toán học (Constant Folding Engine)
function evaluateStaticArithmetic(code) {
    let lastCode = "";
    while (lastCode !== code) {
        lastCode = code;
        code = code.replace(/\b(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)\b/g, (match, a, op, b) => {
            const numA = parseFloat(a);
            const numB = parseFloat(b);
            let res = 0;
            switch (op) {
                case '+': res = numA + numB; break;
                case '-': res = numA - numB; break;
                case '*': res = numA * numB; break;
                case '/': if (numB === 0) return match; res = numA / numB; break;
            }
            return Number.isInteger(res) ? res.toString() : res.toFixed(3);
        });
    }
    return code;
}

// 2.4 Gỡ phẳng luồng điều khiển & Xóa mã rác (Control Flow Unflattening & Junk Clean)
function unflattenControlFlow(code) {
    // Xóa câu lệnh điều kiện vô hiệu (Dead Code)
    code = code.replace(/if\s+(false|0)\s+then[\s\S]*?end;?/gi, '');
    code = code.replace(/repeat\s+([\s\S]*?)\s+until\s+true;?/gi, '$1');

    // Xóa comment bẫy rác
    code = code.replace(/--\[\[[\s\S]*?\]\]/g, '');
    code = code.replace(/--[^\n]*/g, '');

    // Dọn dẹp khoảng trắng rác
    code = code.replace(/\n\s*\n/g, '\n');
    return code;
}

// 2.5 Thuật toán Chuẩn hóa tên biến (Variable Refactoring)
function refactorVariables(code) {
    const obfRegex = /\b(_0x[a-fA-F0-9]+|[lI1_]{5,}|v\d+)\b/g;
    const varMap = new Map();
    let counter = 1;

    let match;
    while ((match = obfRegex.exec(code)) !== null) {
        const name = match[0];
        if (!varMap.has(name)) {
            varMap.set(name, `var_${counter++}`);
        }
    }

    varMap.forEach((newName, oldName) => {
        const reg = new RegExp(`\\b${oldName}\\b`, 'g');
        code = code.replace(reg, newName);
    });

    return code;
}

// 2.6 Định dạng & Thụt lề Code chuẩn Lua (Advanced Beautifier)
function formatLuaStructure(code) {
    const lines = code.split('\n');
    let indent = 0;
    const indentChar = '    ';
    const formatted = [];

    const incRegex = /^\s*(function|if|for|while|repeat|do)\b/;
    const decRegex = /^\s*(end|until)\b/;
    const midRegex = /^\s*(else|elseif)\b/;

    for (let line of lines) {
        let trimmed = line.trim();
        if (!trimmed) continue;

        if (decRegex.test(trimmed)) indent = Math.max(0, indent - 1);

        if (midRegex.test(trimmed)) {
            formatted.push(indentChar.repeat(Math.max(0, indent - 1)) + trimmed);
        } else {
            formatted.push(indentChar.repeat(indent) + trimmed);
        }

        if (incRegex.test(trimmed) && !trimmed.endsWith('end')) indent++;
    }

    return formatted.join('\n');
}

// 2.7 Tạo Dynamic Hook Wrapper (Dành cho trường hợp gặp VM mã hóa cứng)
function attachDynamicHook(code) {
    return `-- ===================================================
-- [DYNAMIC HOOK ENGINE ATTACHED]
-- Phát hiện Lua VM / Mã hóa phức tạp!
-- Copy đoạn mã này chạy trong Executor/Termux để giải mã trực tiếp từ bộ nhớ.
-- ===================================================

local old_load = load
local old_loadstring = loadstring or load

_G.load = function(str, ...)
    if type(str) == "string" then
        print("\n--- [DETECTED UNPACKED CODE (LOAD)] ---")
        print(str)
        print("---------------------------------------\n")
    end
    return old_load(str, ...)
end

_G.loadstring = function(str, ...)
    if type(str) == "string" then
        print("\n--- [DETECTED UNPACKED CODE (LOADSTRING)] ---")
        print(str)
        print("---------------------------------------------\n")
    end
    return old_loadstring(str, ...)
end

-- [MÃ GỐC ĐÃ QUA XỬ LÝ SƠ BỘ BÊN DƯỚI]
` + code;
}

// ==========================================
// 3. PIPELINE KÍCH HOẠT CHÍNH
// ==========================================

function processCode() {
    const rawEl = document.getElementById('rawCode');
    const cleanEl = document.getElementById('cleanCode');

    if (!rawEl || !rawEl.value.trim()) {
        alert("Vui lòng dán code Lua hoặc nạp file!");
        return;
    }

    const inputData = rawEl.value;
    const startTime = performance.now();

    updateStatus("Đang khởi chạy High-Level Engine...", 'info');

    setTimeout(() => {
        try {
            // Bước 1: Quét và giải mã chuỗi đa tầng
            let processed = deepDecodeStrings(inputData);

            // Bước 2: Giả lập bóc tách String Table
            processed = emulateStringTable(processed);

            // Bước 3: Đánh giá và tính toán toán học tĩnh
            processed = evaluateStaticArithmetic(processed);

            // Bước 4: Gỡ phẳng luồng chạy và dọn mã rác
            processed = unflattenControlFlow(processed);

            // Bước 5: Chuẩn hóa lại hệ thống tên biến
            processed = refactorVariables(processed);

            // Bước 6: Định dạng lại cấu trúc code chuẩn
            processed = formatLuaStructure(processed);

            // Bước 7: Kiểm tra sự tồn tại của Lua VM
            if (processed.includes('bytecode') || processed.match(/while\s+var_\d+\s+do/)) {
                processed = attachDynamicHook(processed);
                updateStatus("Phát hiện Lua VM! Đã kích hoạt Dynamic Hook tự động.", 'success');
            } else {
                const endTime = performance.now();
                const duration = ((endTime - startTime) / 1000).toFixed(2);
                updateStatus(`Xử lý hoàn tất trong ${duration}s! Dung lượng: ${formatBytes(inputData.length)} ──> ${formatBytes(processed.length)}`, 'success');
            }

            cleanEl.value = processed;

        } catch (err) {
            console.error(err);
            updateStatus(`Lỗi quá trình phân tích: ${err.message}`, 'error');
        }
    }, 50);
}
