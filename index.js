import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

const EXTENSION_NAME = "Command-button";

// 1. 실행할 기능 (메뉴 팝업)
async function showCommandMenu() {
    const menuHtml = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div id="btn_cut" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid #ccc; border-radius: 10px;">
                ✂️ <b>Cut (삭제)</b>
            </div>
            <div id="btn_hide" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid #ccc; border-radius: 10px;">
                👁️ <b>Hide (숨김)</b>
            </div>
            <div id="btn_jump" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid #ccc; border-radius: 10px;">
                🚀 <b>Jump (이동)</b>
            </div>
        </div>
    `;

    callGenericPopup(menuHtml, POPUP_TYPE.TEXT, '', { okButton: '닫기' });

    setTimeout(() => {
        document.getElementById('btn_cut')?.addEventListener('click', () => runCommand('/cut', '✂️ 삭제 범위', '10-20'));
        document.getElementById('btn_hide')?.addEventListener('click', () => runCommand('/hide', '👁️ 숨길 번호', '35'));
        document.getElementById('btn_jump')?.addEventListener('click', () => runCommand('/chat-jump', '🚀 이동할 번호', '50'));
    }, 100);
}

async function runCommand(cmd, label, hint) {
    document.querySelector('.swal2-confirm')?.click(); // 기존 팝업 닫기
    setTimeout(async () => {
        const input = await callGenericPopup(`<h3>${label}</h3>입력하세요 (예: ${hint})`, POPUP_TYPE.TEXT);
        if (input) await executeSlashCommands(`${cmd} ${input}`);
    }, 300);
}

// 2. 버튼 생성 함수
function createMyButton() {
    const btn = document.createElement('div');
    btn.id = 'my_custom_cmd_btn';
    // 눈에 확 띄게 빨간 테두리 임시 적용 (나중에 삭제 가능)
    btn.style.cssText = "cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 100%; margin: 0 5px;";
    btn.innerHTML = '<i class="fa-solid fa-layer-group" style="font-size: 1.2em;"></i>';
    btn.onclick = showCommandMenu;
    return btn;
}

// 3. 위치 찾기 및 삽입 (핵심!)
function injectButton() {
    // 이미 있으면 중단
    if (document.getElementById('my_custom_cmd_btn')) return;

    // 방법 A: "지팡
