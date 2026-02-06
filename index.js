import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

const EXTENSION_NAME = "Command-button";

// 1. 메뉴 팝업 함수
async function showCommandMenu() {
    const menuHtml = `
        <div class="list-group">
            <div id="btn_cut" class="list-group-item flex-container menu_button">
                <div class="fa-solid fa-scissors"></div>&nbsp; <b>Cut (삭제)</b>
            </div>
            <div id="btn_hide" class="list-group-item flex-container menu_button">
                <div class="fa-solid fa-eye-slash"></div>&nbsp; <b>Hide (숨김)</b>
            </div>
            <div id="btn_jump" class="list-group-item flex-container menu_button">
                <div class="fa-solid fa-share"></div>&nbsp; <b>Jump (이동)</b>
            </div>
        </div>
    `;

    // 팝업 띄우기
    callGenericPopup(menuHtml, POPUP_TYPE.TEXT, '', { okButton: '닫기' });

    // 클릭 이벤트 연결 (jQuery 사용)
    setTimeout(() => {
        $('#btn_cut').on('click', () => runCommand('/cut', '✂️ 삭제 범위', '10-20'));
        $('#btn_hide').on('click', () => runCommand('/hide', '👁️ 숨길 번호', '35'));
        $('#btn_jump').on('click', () => runCommand('/chat-jump', '🚀 이동할 번호', '50'));
    }, 200);
}

// 2. 명령어 실행 도우미
async function runCommand(cmd, label, hint) {
    $('.swal2-confirm').click(); // 기존 팝업 닫기
    
    setTimeout(async () => {
        const input = await callGenericPopup(`<h3>${label}</h3>입력하세요 (예: ${hint})`, POPUP_TYPE.TEXT);
        if (input) {
            await executeSlashCommands(`${cmd} ${input}`);
        }
    }, 300);
}

// 3. 버튼 생성 및 삽입 (jQuery 방식)
function addButton() {
    // 이미 버튼이 있으면 중단
    if ($('#my_quick_cmd_btn').length) return;

    // 타겟: 지팡이 버튼 (#extensions_button)
    const $target = $('#extensions_button');

    if ($target.length) {
        // 버튼 HTML 생성
        const $btn = $(`
            <div id="my_quick_cmd_btn" class="menu_button" title="빠른 명령어">
                <i class="fa-solid fa-layer-group"></i>
            </div>
        `);

        // 스타일 적용 (기존 버튼들과 위화감 없게)
        $btn.css({
            'cursor': 'pointer',
            'display': 'flex',
            'align-items': 'center',
            'justify-content': 'center',
            'width': 'var(--bottomBarHeight, 50px)', // 높이 자동 조절
            'margin-left': '5px'
        });

        // 클릭 이벤트
        $btn.on('click', showCommandMenu);

        // ★ 핵심: 지팡이 버튼 뒤에 삽입
        $target.after($btn);
        
        console.log(`[${EXTENSION_NAME}] 버튼이 지팡이 옆에 설치되었습니다.`);
        return true;
    }
    return false;
}

// 4. 로딩 대기 (실리태번 표준 방식)
$(document).ready(function () {
    // 1초마다 검사해서 지팡이 버튼이 생기면 내 버튼을 붙임
    const interval = setInterval(() => {
        if (addButton()) {
            clearInterval(interval); // 성공하면 반복 종료
        }
    }, 1000);
});
