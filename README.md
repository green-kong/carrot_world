# 코딩 컨벤션

- 객체 마지막 프로퍼티 쉼표
- 들여쓰기 2칸
- 식의 끝에는 세미콜론 필수
- string 정의 시 single quote 사용 || template literal 시 backtic
- 객체 시작과 끝 띄어쓰기
- arrow function parameter 괄호 사용
- 변수 정의시 camelCase 사용
- 상수 정의시 ALL_CAPS 사용
- 함수명은 verb

# 커밋 컨벤션

- 제목은 영어로 50자 이내

- back || front 구분 + 기능개발 큰 카테고리

  - such as ... [back/user] && [front/board]

- commit message
  - feat : 기능개발
    - such as ... [back/user]feat : login when user aleready sign-up keep processing login
    - [back/user]feat : login when user didnt sign-up insert user data to DB
  - bugFix : 버그 수정
  - style : 코딩스타일 수정 || 오타 수정
    - such as ... replay -> reply
  - docs : 문서수정
    - such as ... README.md
  - refact : 리팩토링

# PR 컨벤션

- 커밋 컨벤션 양식 유지

# API 설계

### front

- :3000/ -> 메인페이지, 회원가입, 로그인

- :3000/home ->

  1. 홈메인
  2. 사이드바 메뉴 클릭 시 -> 해당 데이터 보여줌(axios)
  3. 사이드바 유저정보 (판매중 물품, 내정보보기, 채팅알림, 로그아웃 버튼) 페이지 이동
  4. 상단헤더 -> 검색기능(axios)
  5. 판매물품 등록(sel/opt 경매로 || 일반거래)

- :3000/user/profile 내가 올린 게시글, 내 글 보기, 댓글 수, 찜 목록,( 정보수정 또는 회원탈퇴 )

- :3000/user/board/edit -> 내 글 수정 페이지

- :3000/user/update 정보수정, 회원탈퇴

- :3000/chat ->
  좌측에 대화목록 클릭 시
  우측에 채팅방 내용 보여짐(axios)

- :3000/qa/list -> 1:1 문의 목록

- :3000/qa/view -> 1:1 문의글 확인 페이지

- :3000/qa/write -> 1:1 문의글 작성 페이지

- :3000/qa/edit -> 1:1 문의글 수정

- :3000/admin -> 관리자 로그인페이지

- :3000/admin/user -> 관리자 회원관리 페이지

- :3000/admin/board -> 관리자 전체 게시글 페이지(select/option 카테고리별 볼수잇게끔)

- :3000/admin/board/sell -> 관리자 중고거래 게시글 페이지

- :3000/admin/board/auction -> 관리자 경매 게시글 페이지

- :3000/admin/category -> 관리자 카테고리 추가/수정/삭제 페이지

- :3000/admin/statistic -> 관리자 통계 페이지

### back

#### user

- :4000/api/user/login -> 로그인

- :4000/api/user/logout -> 로그아웃

- :4000/api/user/join -> 회원가입

- :4000/api/user/kakao -> 카카오로그인

- :4000/api/user/naver -> 네이버로그인

- :4000/api/user/google -> 구글로그인

- :4000/api/user/update -> 회원정보수정

- :4000/api/user/quit -> 회원탈퇴

- :4000/api/user/board/edit -> 내 글 수정

- :4000/api/user/board/delete -> 내 글 삭제

#### home

- :4000/api/home/ -> 찜많은 순 데이터 8개, 카테고리별로 4개씩

- :4000/api/home/sell -> 중고거래 전체 목록 최근등록순으로 순으로 처음에는 20개

- :4000/api/home/sell/clo -> 중고거래 의류 목록 20개

- :4000/api/home/sell/acc -> 중고거래 잡화 목록 20개

- :4000/api/home/sell/fur -> 중고거래 가구 목록 20개

- :4000/api/home/sell/elc -> 중고거래 가전 목록 20개

- :4000/api/home/sell/pet -> 중고거래 반려동물용품 목록 20개

- :4000/api/home/auc -> 경매 전체 목록 최근등록순으로 순으로 처음에는 20개

- :4000/api/home/auc/clo -> 경매 의류 목록 20개

- :4000/api/home/auc/acc -> 경매 잡화 목록 20개

- :4000/api/home/auc/fur -> 경매 가구 목록 20개

- :4000/api/home/auc/elc -> 경매 가전 목록 20개

- :4000/api/home/auc/pet -> 경매 반려동물용품 목록 20개

- :4000/api/home/write -> 거래등록

#### admin

- :4000/api/admin/login -> 관리자 로그인

- :4000/api/admin/statistic ->

  1. 카테고리별 활성도
  2. 게시물이 제일 많은 카테고리
  3. 게시물을 제일 많이 등록한 회원
  4. 거래완료가 가장 많은 회원
  5. 포인트 가장 많은 회원

- :4000/api/admin/board -> 전체 게시글 목록
  => 카테고리 별 게시글 목록은 /api/home 사용

- :4000/api/admin/user -> 전체 유저 목록

#### qa

- :4000/api/qa/list -> 1:1 문의글 목록

- :4000/api/qa/write -> 1:1 문의글 작성

- :4000/api/qa/edit -> 1:1 문의글 수정

- :4000/api/qa/delete -> 1:1 문의글 삭제

- :4000/api/qa/view -> 1:1 문의글 보기 + 댓글내용까지 자기가 쓴글 아니면 못들어가게

- :4000/api/qa/reply/write -> 댓글 쓰기

- :4000/api/qa/reply/update -> 댓글 수정

- :4000/api/qa/reply/delete -> 댓글삭제

- / (로그인, 회원가입)

  1. 로그인

  - 소셜 로그인(네이버, 카카오, 구글)
  - mainPage 로 이동

  2. 회원가입

  - '/' 로 이동

- /main ( ) (비동기통신)

  - Default 중고 거래 화면 (전체 카테고리)
    - 카테고리 별로 4개 정도 보이게.
  - sidebar 세부 카테고리

    - 세부카테고리 클릭 시 해당 카테고리 게시글 목록 보여주기.
    - 한번에 스무개 씩 갖고온다. (무한스크롤)
    - 사용자 정보
      - 프로필사진
      - 판매중 ?? / 판매완료 ??
      - point ???pt
      - 채팅 ??개

  - 상단 헤더 검색 기능 (axios)

    - 카테고리, 제목, 태그, 사용자

  - 목록 버튼을 만든다고 치면,
    최상단으로 보내고,

- /message url 이동

  - socket 통신

- /auction url 이동(화섭 아뱅)

  - 경매 카테고리
  - 경매 시작가
  - 사람들이 input 123121523 제시
  - 1200(가격을 소켓통신으로 최신화)

- /user/profile url 이동

  - 비밀번호 입력
  - 회원정보
  - 정보수정, 회원탈퇴

- admin

  - 게시글 목록
  - 유저목록
  - 카테고리 추가/수정/삭제

- admin/statistic
- 카테고리별 활성도
- 게시물이 제일 많은 카테고리
- 게시물을 제일 많이 등록한 회원
- 거래완료가 가장 많은 회원
- 포인트 가장 많은 회원

# DB Schema

[DB diagram.io](https://dbdiagram.io/)를 이용해서 ERD 만들었음

디비 스키마 사진

### - user

- u_id INT PK AI
- userEmail VARCHAR(32)
- sns_id VARCHAR(255)
- userPw VARCHAR(255)
- userAlias VARCHAR(32)
- userMobile VARCHAR(22)
- point INT default 0

### - sell_items

- s_id INT PK AI
- c_code VARCHAR(6) NOT NULL
  - clo(의류)
  - acc(잡화)
  - elc(가전)
  - fur(가구)
  - pet(반려동물)
- subject(판매제목) VARCHAR(64) NOT NULL
- u_id(판매자) INT NOT NULL
- price(가격) INT NOT NULL
- content VARCHAR(255) NOT NULL
- how(직거래,택배) TINYINT(1)
- location(희망거래장소) VARCHAR(32)
- like(찜) INT default 0
- report(신고) INT default 0
- isSold(거래중,완료) TINYINT(1)
- date timestamp NOT NULL

### - s_tag(중고거래 해시태그)

- s_id INT [ref: > s_items.s_id]
- tag1 VARCHAR(16)
- tag2 VARCHAR(16)
- tag3 VARCHAR(16)
- tag4 VARCHAR(16)
- tag5 VARCHAR(16)

### - s_likes(중고거래 찜)

- u_id INT [ref: > user.u_id]
- s_id INT [ref: > s_items.s_id]

### - s_report(중고거래 신고)

- u_id INT [ref: > user.u_id]
- s_id INT [ref: > s_items.s_id]

### - s_img

- s_id INT [ref: > s_items.s_id]
- img1 VARCHAR(255)
- img2 VARCHAR(255)
- img3 VARCHAR(255)
- img4 VARCHAR(255)
- img5 VARCHAR(255)

### - auction (경매)

- au_id PK AI
- c_code VARCHAR(6) NOT NULL
  - clo(의류)
  - acc(잡화)
  - elc(가전)
  - fur(가구)
  - pet(반려동물)
- subject(판매제목) VARCHAR(64) NOT NULL
- u_id(판매자) INT NOT NULL
- price(가격) INT NOT NULL
- content VARCHAR(255) NOT NULL
- how(직거래,택배) TINYINT(1)
- location(희망거래장소) VARCHAR(32)
- like(찜) INT default 0
- period(경매기간) timestamp NOT NULL
- date timestamp NOT NULL

### - au_likes(경매 찜)

- u_id INT [ref: > user.u_id]
- au_id INT [ref: > au_items.au_id]

### - au_img

- au_id INT [ref: > au_items.au_id]
- img1 VARCHAR(255)
- img2 VARCHAR(255)
- img3 VARCHAR(255)
- img4 VARCHAR(255)
- img5 VARCHAR(255)

### qa

- q_id INT PK AI
- u_id INT NOT NULL
- subject VARCHAR(64)
- content VARCHAR(255)
- date timestamp NOT NULL

### q_reply

- q_id INT NOT NULL
- content VARCHAR(64)
- date timestamp NOT NULL

### category

c_code VARCHAR(6) NOT NULL PK
c_name VARCHAR(16) NOT NULL

# 업무분담

기능개발

- 퍼블리싱

  - 메인페이지 지금 당장 안중요해(로그인/회원가입)

    - about 페이지
    - 맨마지막에 로그인 회원가입

  - /home

    - 헤더
      - 로고, 검색(sel/opt)
    - 사이드바
      - 사용자 정보 ( 판매중인 물품, 채팅 알림(채팅a태그), 포인트, 사용자이름, 프사, 찜한물품 갯수)
      - 게시판 카테고리 (중고거래(의류,잡화,반려동물,가구,가전), 경매거래(의류,잡화,반려동물,가구,가전))
      - 고객센터
        - 1:1 문의
    - 컨텐츠 부분
      - home List(인기매물 8개,카테고리별 4개씩)
      - 카테고리별 리스트
      - 경매 리스트( 경매마감 까지 얼마나남았는지 보여주는 UI 필요함)
      - 중고거래 등록 페이지
      - 경매거래 등록 페이지
      - 중고거래 확인 페이지
      - 경매거래 확인 페이지
      - 1:1 문의글 등록페이지
      - 1:1 문의글 확인페이지 ( 댓글 )

  - 사용자 정보 페이지

    - 회원가입하고 똑같이 만들고 밑에 버튼만 바꿔주면 됨

  - 관리자 페이지

    - 통계
    - 게시글 목록
      - 카테고리
    - 회원목록

    - 카테고리 추가/수정/삭제
      관리자
      카테고리 이름 노트북&주변기기/
      카테고리 코드 lab

### 동훈

Git 관리

### 연정

DB 관리

### 화섭

DB 관리

# 변수정리

# 일일회의록

<details>
<summary>토글 접기/펼치기</summary>
<div markdown="1">

안녕

</div>
</details>
