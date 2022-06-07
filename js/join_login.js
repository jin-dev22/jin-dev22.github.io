//----------------------------- 공통사용 코드 ----------------------------------------------
/**
 * 유저리스트에서 아이디가 존재하면 해당유저객체 반환
 */
 function findIdAtList(id, userArr){
    let existUser;
    userArr.forEach((user)=>{
        if(id === user.id)
            existUser = user;
    })
    return existUser;
}

/**
 * 회원 클래스
 */
class User{
    constructor(id, pwd, name, email, birthDate, gender = 'none', regDate = Date.now()){
        this.id = id;
        this.pwd = pwd;
        this.name = name;
        this.email = email;
        this.birthDate = birthDate;
        this.gender = gender;
        this.regDate = regDate;
    };
};
//----------------------------- 회원가입페이지 코드 -----------------------------------------
/**
 * 성별체크박스 라디오처럼 작동
 */
const checkOne = (ckbox) => {
    const ckBoxArr = document.querySelectorAll('[id^=gender]');
    for (let i = 0; i < ckBoxArr.length; i++)
        (ckBoxArr[i] != ckbox) && (ckBoxArr[i].checked = false);
};

/**
 * user객체 받아서 유효성 검사, 통과시 localStorage에 저장, boolean리턴
 */
function saveUserIfValid() {
    //개인정보 제공 동의서 확인
    const agreementList = document.getElementsByName('agreement');
    const isAgree = getValueFrmList(agreementList) === 'Y' ? true : false;
    if(!isAgree){
        alert('개인정보 수집/이용 비동의시 회원가입이 불가능합니다.')
        return false;
    }

    const userId = document.getElementById("userId");
    const pwd = document.getElementById("pwd");
    const pwdCheck = document.getElementById("pwdCheck");
    const userName = document.getElementById("userName");
    const email = document.getElementById("email");    
    const birthDate = document.getElementById("birthDate");
    const genderList = document.getElementsByName('gender');
    const gender = getValueFrmList(genderList);

    //아이디: 영문, 숫자, -, _만 가능 6~12자
    if(!regExpTest(/^[a-z0-9_-]{6,12}$/i ,userId,"아이디는 6~12자 이내, 영문/숫자/특수문자(-_)만 사용가능합니다."))
        return false;

    //아이디 중복 체크
    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    if(findIdAtList(userId.value, userList)){

        alert("이미 사용중인 아이디 입니다.");
        userId.select();
        return false;
    };

    //비밀번호: 영문+숫자 +특문 8~20자
    if(!regExpTest(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W)(?=.*[!@#$%^&*-+]).{8,20}$/, pwd, "비밀번호는 8~20자 이내, 영문/숫자/특수문자(!@#$^*+=- 중 하나이상)를 모두 포함해야 합니다."))
        return false;    

    //비밀번호 확인
    if (pwd.value !== pwdCheck.value) {
        alert("비밀번호가 일치하지 않습니다.");
        pwd.select();
        return false;
    }

    //이름 체크
    if(!regExpTest(/^[가-힣]{2,}$/i, userName, "이름은 한글 2글자 이상 입력해주시기 바랍니다."))
        return false;

    //이메일 양식 체크
    //(4글자)@(1글자이상)(.com|.or.kr등)
    if (!regExpTest(/^[\w]{4,}@[\w]+(\.[\w]+){1,3}$/, email, "이메일 형식에 맞지 않습니다."))
        return false;
   
    //생일 < 현재날짜 체크
    const today = new Date();
    if(birthDate.valueAsDate > today){
        alert('현재 날짜 이후는 선택하실 수 없습니다.');
        return false;
    }
    //user객체 저장
    const newUser = new User(userId.value, pwd.value, userName.value, email.value, birthDate.valueAsDate, gender)
    userList.push(newUser);
    const data = JSON.stringify(userList);
    localStorage.setItem('userList', data);
    console.log('userList저장완료!');
    return true;
};

/**
 * 정규식 확인 메소드
 */
function regExpTest(regExp, el, msg) {
    if (regExp.test(el.value)){
        return true;
    } 
    else{
        alert(msg);
        el.value = "";
        el.select();
        return false;
    }
};

/**
 * 선택값 리스트에서 checked된 value 리턴
 */
function getValueFrmList(list){
    let val;
    list.forEach(elem => {
        if(elem.checked)
            val = elem.value;
    });
    return val;
};


//-------------------------------------------------로그인 페이지 ---------------------------
/**
 * 아이디, 비번 맞을경우 로그인 성공 알림창 띄우고 메인페이지로 이동
 */
function login() {
    const loginId = document.getElementById("loginId");
    const loginPwd = document.getElementById("loginPwd");

    const userList = JSON.parse(localStorage.getItem('userList')) || [];
    const existUser = findIdAtList(loginId.value, userList);
    if(!existUser){
        alert("존재하지 않는 아이디 입니다.");
        loginId.select();
        return false;
    };
    if(loginPwd.value !== existUser.pwd){
        alert("비밀번호가 틀렸습니다.");
        loginPwd.select();
        return false;
    } else {
        alert(`${existUser.name}님, 반갑습니다!`);
        //메인페이지로 이동
        // location.replace('../html/index.html');//이전 페이지로 돌아가기 불가능
        location.href = '../html/index.html';//이전페이지 돌아가기 가능
    };
};  
