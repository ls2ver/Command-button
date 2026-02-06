import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

// 버튼을 추가할 컨테이너를 찾거나 생성하는 함수
function addButtons() {
    // 채팅 입력창 상단 툴바에 추가
    const container = document.getElementById('extensions_settings');
    
    const wrapper = document.createElement('div');
    wrapper.id = 'quick-cmd-wrapper';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '5px';
    wrapper.style.margin = '5px';

    // 버튼 설정 정보
    const buttons = [
        { label: '✂️ Cut', cmd: '/cut', prompt: '삭제할 범위를 입력하세요 (예: 1-5)' },
        { label: '👁️ Hide', cmd: '/hide', prompt: '숨길 메시지 번호를 입력하세요' },
        { label: '🚀 Jump', cmd: '/chat-jump', prompt: '이동할 메시지 번호를 입력하세요' }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('div');
        button.className = 'menu_button custom-cmd-btn';
        button.innerText = btn.label;
        button.onclick = async () => {
            const input = await callGenericPopup(btn.prompt, POPUP_TYPE.TEXT);
            if (input) {
                await executeSlashCommands(`${btn.cmd} ${input}`);
            }
        };
        wrapper.appendChild(button);
    });

    // 실리태번 왼쪽 하단 확장 설정 영역에 추가
    container.appendChild(wrapper);
}

// 확장팩 로드 시 실행
(function() {
    console.log("Quick Command Buttons Extension Loaded");
    addButtons();
})();
