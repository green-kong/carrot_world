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
- category VARCHAR(6) NOT NULL
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
- category VARCHAR(6) NOT NULL
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
- period(경매기간) INT(1)
- date timestamp NOT NULL

### - au_likes(중고거래 찜)

- u_id INT [ref: > user.u_id]
- au_id INT [ref: > au_items.au_id]

### - au_report(중고거래 신고)

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

# 업무분담

# 변수정리

# 일일회의록

<details>
<summary>토글 접기/펼치기</summary>
<div markdown="1">

안녕

</div>
</details>
