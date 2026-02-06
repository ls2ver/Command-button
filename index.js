import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

// 1. 메뉴 기능
async function showCommandMenu() {
    const menuHtml = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div id="btn_cut" class="menu_button" style="padding: 15px; border: 1px solid var(--white-30); border-radius: 10px;">✂️ <b>Cut (삭제)</b></div>
            <div id="btn_hide" class="menu_button" style="padding: 15px; border: 1px solid var(--white-30); border-radius: 10px;">👁️ <b>Hide (숨김)</b></div>
            <div id="btn_jump" class="menu_button" style="padding: 15px; border: 1px solid var(--white-30); border-radius: 10px;">🚀 <b>Jump (이동)</b></div>
        </div>
    `;
    callGenericPopup(menuHtml, POPUP_TYPE.TEXT, '', { okButton: '닫기' });

    setTimeout(() => {
        $('#btn_cut').on('click', () => runCommand('/cut', '✂️ 삭제 범위', '10-20'));
        $('#btn_hide').on('click', () => runCommand('/hide', '👁️ 숨길 번호', '35'));
        $('#btn_jump').on('click', () => runCommand('/chat-jump', '🚀 이동할 번호', '50'));
    }, 200);
}

async function runCommand(cmd, label, hint) {
    $('.swal2-confirm').click();
    setTimeout(async () => {
        const input = await callGenericPopup(`<h3>${label}</h3>입력하세요 (예: ${hint})`, POPUP_TYPE.TEXT);
        if (input) await executeSlashCommands(`${cmd} ${input}`);
    }, 300);
}

// 2. 버튼 만들기
function createMyBtn() {
    return $(`
        <div id="my_cmd_btn" title="커맨드">
            <i class="fa-solid fa-layer-group"></i>
        </div>
    `).css({
        'cursor': 'pointer',
        'width': '40px',
        'height': '100%',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-size': '1.2em',
        'margin': '0 2px',
        'color': 'var(--smart-theme-body-color)'
    }).on('click', showCommandMenu);
}

// 3. 위치 찾기 및 삽입 (우선순위 로직)
function inject() {
    if ($('#my_cmd_btn').length) return; // 이미 있으면 중단

    const $btn = createMyBtn();

    // 1순위: 지팡이 버튼 (#extensions_button) 뒤
    const $wand = $('#extensions_button');
    if ($wand.length && $wand.is(':visible')) {
        $wand.after($btn);
        console.log("지팡이 옆에 설치함");
        return;
    }

    // 2순위: 지팡이 아이콘 클래스로 찾기
    const $wandIcon = $('.fa-wand-magic-sparkles');
    if ($wandIcon.length) {
        $wandIcon.closest('div').after($btn);
        console.log("지팡이 아이콘 찾아서 옆에 설치함");
        return;
    }

    // 3순위 (비상): 입력창 전송 버튼 (#send_but_sheld) 왼쪽
    const $sendBtn = $('#send_but_sheld');
    if ($sendBtn.length) {
        $sendBtn.before($btn);
        console.log("지팡이 없어서 전송 버튼 옆에 설치함");
        return;
    }
}

// 4. 무한 반복 감시 (될 때까지)
$(document).ready(() => {
    // 로드 확인용 알림 (성공하면 나중에 주석 처리하세요)
    if(typeof toastr !== 'undefined') toastr.info("커맨드 버튼 확장 로드됨 (v2.0)");

    setInterval(inject, 1000);
});
