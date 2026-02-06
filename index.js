import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";
import { event_types, eventSource } from "../../../script.js";

const EXTENSION_NAME = "Command-button";

// 메시지 메뉴가 열릴 때 실행되는 함수
function addButtonsToMessageMenu(messageId) {
    const menu = document.getElementById('message_menu');
    if (!menu) return;

    // 이미 버튼이 있으면 중복 추가 방지
    if (menu.querySelector('.custom-cmd-separator')) return;

    // 구분선 추가
    const separator = document.createElement('div');
    separator.className = 'custom-cmd-separator';
    separator.style.borderTop = '1px solid rgba(128,128,128,0.3)';
    separator.style.margin = '5px 0';
    menu.appendChild(separator);

    // 버튼 목록
    const buttons = [
        { label: '✂️ Cut (삭제)', cmd: '/cut', hint: '10-20' },
        { label: '👁️ Hide (숨김)', cmd: '/hide', hint: '숨길 번호' },
        { label: '🚀 Jump (이동)', cmd: '/chat-jump', hint: '이동할 번호' }
    ];

    buttons.forEach(btn => {
        const item = document.createElement('div');
        // 실리태번 메뉴 스타일 적용
        item.className = 'list-group-item'; 
        item.innerHTML = `<span>${btn.label}</span>`;
        item.style.cursor = 'pointer';
        item.style.padding = '5px 10px';
        
        item.onclick = async () => {
            menu.style.display = 'none'; // 메뉴 닫기
            const input = await callGenericPopup(
                `[${btn.label}]\n범위를 입력하세요 (ID: ${messageId})`,
                POPUP_TYPE.TEXT
            );
            if (input) {
                await executeSlashCommands(`${btn.cmd} ${input}`);
            }
        };
        menu.appendChild(item);
    });
}

jQuery(document).ready(function () {
    console.log(`${EXTENSION_NAME} 준비 완료!`);
    // 메시지 메뉴가 열리는 이벤트를 감지
    eventSource.on(event_types.MESSAGE_OPTS_SHOWN, (messageId) => {
        addButtonsToMessageMenu(messageId);
    });
});
