import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

const EXTENSION_NAME = "Command-button";

// 1. 실제 명령어를 실행하는 로직
async function runCommand(cmd, label, hint) {
    // 범위를 입력받는 팝업 띄우기
    const input = await callGenericPopup(
        `<h3>${label}</h3>범위나 숫자를 입력하세요.<br><small style="color:gray">(예: ${hint})</small>`,
        POPUP_TYPE.TEXT
    );

    if (input) {
        await executeSlashCommands(`${cmd} ${input}`);
    }
}

// 2. 버튼 눌렀을 때 뜨는 메뉴 (선택창)
async function showCommandMenu() {
    // 메뉴 디자인 (HTML)
    const menuHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div id="btn_cut" class="menu_button" style="padding: 10px; cursor: pointer;">
                ✂️ <b>Cut (삭제)</b>
            </div>
            <div id="btn_hide" class="menu_button" style="padding: 10px; cursor: pointer;">
                👁️ <b>Hide (숨김)</b>
            </div>
            <div id="btn_jump" class="menu_button" style="padding: 10px; cursor: pointer;">
                🚀 <b>Jump (이동)</b>
            </div>
        </div>
    `;

    // 팝업 띄우기 (내용만 보여줌)
    callGenericPopup(menuHtml, POPUP_TYPE.TEXT, '', { okButton: '닫기' });

    // 팝업이 뜨고 난 뒤 클릭 이벤트 연결 (0.1초 딜레이)
    setTimeout(() => {
        // Cut 버튼
        document.getElementById('btn_cut')?.addEventListener('click', () => {
            // 현재 팝업 닫고 실행 팝업 띄우기 (약간의 트릭)
            document.querySelector('.swal2-confirm')?.click(); 
            setTimeout(() => runCommand('/cut', '✂️ Cut (삭제)', '10-20'), 300);
        });

        // Hide
