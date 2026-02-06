import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

function addButtons() {
    // 이미 버튼이 있다면 중복 생성 방지
    if (document.getElementById('quick-cmd-wrapper')) return;

    // 채팅 입력창 근처(상단 툴바)에 강제 삽입
    const target = document.querySelector('.extension_container') || document.getElementById('extensions_settings');
    
    if (!target) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'quick-cmd-wrapper';
    wrapper.innerHTML = `<div style="color:var(--mainColor); font-weight:bold; margin: 10px 0 5px 5px;">⚡ 빠른 명령어</div>`;
    wrapper.style.padding = '10px';

    const buttons = [
        { label: '✂️ Cut', cmd: '/cut', prompt: '삭제 범위 (예: 1-5)' },
        { label: '👁️ Hide', cmd: '/hide', prompt: '숨길 번호' },
        { label: '🚀 Jump', cmd: '/chat-jump', prompt: '이동할 번호' }
    ];

    buttons.forEach(btn => {
        const button = document.createElement('div');
        button.className = 'menu_button custom-cmd-btn';
        button.style.display = 'inline-block';
        button.style.margin = '2px';
        button.innerText = btn.label;
        button.onclick = async () => {
            const input = await callGenericPopup(btn.prompt, POPUP_TYPE.TEXT);
            if (input) {
                await executeSlashCommands(`${btn.cmd} ${input}`);
            }
        };
        wrapper.appendChild(button);
    });

    target.prepend(wrapper); // 메뉴 최상단에 붙이기
}

// 실리태번이 완전히 로드된 후 실행되도록 지연 실행
setTimeout(addButtons, 1000);
