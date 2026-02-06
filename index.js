import { executeSlashCommands } from "../../../slash-commands.js";
import { callGenericPopup, POPUP_TYPE } from "../../../popup.js";

const EXTENSION_NAME = "Command-button";

// 1. 메뉴 보여주기 기능
async function showCommandMenu() {
    const menuHtml = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
            <div id="btn_cut" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid var(--white-30); border-radius: 10px;">
                ✂️ <b>Cut (삭제)</b>
            </div>
            <div id="btn_hide" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid var(--white-30); border-radius: 10px;">
                👁️ <b>Hide (숨김)</b>
            </div>
            <div id="btn_jump" class="menu_button" style="padding: 15px; text-align: center; border: 1px solid var(--white-30); border-radius: 10px;">
                🚀 <b>Jump (이동)</b>
            </div>
        </div>
    `;

    callGenericPopup(menuHtml, POPUP_TYPE.TEXT, '', { okButton: '닫기' });

    // 팝업 내부 버튼 클릭 이벤트 연결
    setTimeout(() => {
        document.getElementById('btn_cut')?.addEventListener('click', () => runCommand('/cut', '✂️ 삭제 범위', '10-20'));
        document.getElementById('btn_hide')?.addEventListener('click', () => runCommand('/hide', '👁️ 숨길 번호', '35'));
        document.getElementById('btn_jump')?.addEventListener('click', () => runCommand('/chat-jump', '🚀 이동할 번호', '50'));
    }, 200);
}

// 2. 명령어 실행 도우미
async function runCommand(cmd, label, hint) {
    // 열려있는 메뉴 팝업 닫기
    const confirmBtn = document.querySelector('.swal2-confirm');
    if (confirmBtn) confirmBtn.click();

    setTimeout(async () => {
        const input = await callGenericPopup(`<h3>${label}</h3>입력하세요 (예: ${hint})`, POPUP_TYPE.TEXT);
        if (input) {
            await executeSlashCommands(`${cmd} ${input}`);
        }
    }, 300);
}

// 3. 버튼 생성 및 부착 (가장 중요한 부분)
function injectButton() {
    // 이미 내 버튼이 있으면 더 이상 아무것도 안 함 (중복 방지)
    if (document.getElementById('my_quick_cmd_btn')) return;

    // 1순위 타겟: 확장 설정 버튼 (지팡이)
    const wandBtn = document.getElementById('extensions_button');
    
    // 2순위 타겟: 지팡이 아이콘 클래스로 찾기 (ID가 다를 경우 대비)
    const wandIcon = document.querySelector('.fa-wand-magic-sparkles');
    const target = wandBtn || (wandIcon ? wandIcon.closest('.menu_button') : null);

    if (target) {
        // 버튼 만들기
        const myBtn = document.createElement('div');
        myBtn.id = 'my_quick_cmd_btn';
        myBtn.className = 'menu_button'; // 기존 버튼들과 스타일 통일
        myBtn.style.cssText = 'cursor: pointer; display: flex; align-items: center; justify-content: center; width: var(--bottomBarHeight, 50px);';
        myBtn.title = '빠른 명령어';
        myBtn.innerHTML = '<i class="fa-solid fa-layer-group"></i>';
        myBtn.onclick = showCommandMenu;

        // 지팡이 버튼 바로 뒤에 붙이기
        target.after(myBtn);
        
        console.log(`[${EXTENSION_NAME}] 버튼 설치 성공!`);
        return true; // 성공 신호
    }
    return false; // 아직 못 찾음
}

// 4. 무한 추적 시작 (지팡이가 생길 때까지 계속
