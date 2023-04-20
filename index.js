const $dropdown = document.querySelector("#dropdown select");
const $tableArea = document.querySelector("#table");
const $pagination = document.querySelector("#pagination");
const $pageBtns = document.querySelectorAll("#pagination button");

let MEMBER_INFO_SIZE = 0;
let NOW_ELE_SIZE = $dropdown.value;
let PAGINATION_LENGTH = $pageBtns.length - 2;
const pageObj = {};
const memberBySize = new Map();

/**
 * 부모의 모든 child 삭제
 * @param {*} ele 
 */
function removeAllEle(ele) {
    ele.innerHTML = "";
}

/**
 * member 테이블 마크업
 * @param {*} infoArr 
 */
function markupMemberInfo(infoArr) {
    removeAllEle($tableArea);
    const $table = document.createElement("table");
    const $thead = document.createElement("thead");
    const $tbody = document.createElement("tbody");
    const TABLEHEAD = ["name", "title", "email", "role"];
    $thead.innerHTML = TABLEHEAD.map(ele => `<th>${ele}</th>`).join('');
    $tbody.innerHTML = infoArr.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.title}</td>
            <td>${member.email}</td>
            <td>${member.role}</td>
        </tr>
    `).join('');
    $table.append($thead, $tbody);
    $tableArea.append($table);
}

/**
 * member data 가져오기
 * @param {*} size 
 * @param {*} page 
 */
async function setMemberInfo(page) {
    if(memberBySize.get(NOW_ELE_SIZE) === undefined) {
        const memberInfo = await getMembersInfo();
        if(MEMBER_INFO_SIZE === 0) {
            MEMBER_INFO_SIZE = memberInfo.length;
        }
        const memberObj = {};
        for(let i = 1; i <= PAGINATION_LENGTH; i++) {
            memberObj[i] = memberInfo.slice((i - 1) * NOW_ELE_SIZE, i * NOW_ELE_SIZE);
        }
        memberBySize.set(NOW_ELE_SIZE, memberObj);
    }
    const memberObj = memberBySize.get(NOW_ELE_SIZE);
    markupMemberInfo(memberObj[page]);
}

/**
 * pagination 마크업
 * @param {*} size 
 */
function markupPagination() {
    removeAllEle($pagination);
    if(pageObj[PAGINATION_LENGTH] === undefined) {
        const pageNums = Array.from(new Array(PAGINATION_LENGTH + 2).fill(0), (a, i) => a += i);
        pageObj[PAGINATION_LENGTH] = pageNums.map(num => {
            let button = null;
            if(num === 0) {
                button = `<button class="arrow"><<</button>`;
            } else if (num === PAGINATION_LENGTH + 1) {
                button = `<button class="arrow">>></button>`
            } else if (num === 1) {
                button = `<button style="color: red">${num}</button>`
            } else {
                button = `<button>${num}</button>`
            }
            return button;
        }).join('');
    }
    $pagination.innerHTML = pageObj[PAGINATION_LENGTH];
    const $buttons = $pagination.querySelectorAll("button");
    addEventBtn($buttons);
}

/**
 * table data 개수 변경 이벤트
 * @param {*} e 
 */
function handleChangeSize(e) {
    NOW_ELE_SIZE = e.target.value;
    PAGINATION_LENGTH = Math.ceil(MEMBER_INFO_SIZE/NOW_ELE_SIZE);
    markupPagination();
    setMemberInfo(1);
}

/**
 * pagination 클릭 이벤트
 */
function handleClickPage(page) {
    let movePage = 0;
    if(page === 0) {
        movePage = 1;
    } else if(page === PAGINATION_LENGTH + 1) {
        movePage = PAGINATION_LENGTH;
    } else {
        movePage = page;
    }
    setMemberInfo(movePage);
    const $nowPageBtns = $pagination.querySelectorAll("button");
    $nowPageBtns.forEach((btn, i) => {
        if(i === movePage) {
            btn.style.setProperty("color", "red");
        } else {
            btn.style.setProperty("color", null);
        }
    });
}


function addEventBtn($ele) {
    $ele.forEach(($pageBtn, i) => {
        $pageBtn.addEventListener("click", () => handleClickPage(i))
    });
}

$dropdown.addEventListener("change", handleChangeSize);

window.onload = () => {
    handleClickPage(1);
    addEventBtn($pageBtns);
};