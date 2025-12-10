# 기능 명세서 및 API 연동 가이드

이 문서는 GitHub Clone 프로젝트의 피드 기능을 위한 백엔드 API 명세서입니다. 프론트엔드와 백엔드 간의 데이터 연동을 위한 규격을 정의합니다.

## 1. 개요
*   **프로젝트명**: GitHub Clone with Feed
*   **목표**: GitHub 스타일의 UI에 인스타그램과 유사한 피드 기능을 통합
*   **기본 URL**: `https://api.example.com/v1` (예시)

## 2. 데이터 모델 (Types)

### User (사용자)
```typescript
interface User {
  id: string;          // 사용자 고유 ID
  username: string;    // 사용자명 (예: "vercel")
  email: string;       // 이메일
  avatarUrl: string;   // 프로필 이미지 URL
  bio?: string;        // 자기소개
  followers: number;   // 팔로워 수
  following: number;   // 팔로잉 수
}
```

### Repository (저장소)
```typescript
interface Repository {
  id: string;
  name: string;        // 저장소 이름 (예: "next.js")
  fullName: string;    // 전체 이름 (예: "vercel/next.js")
  description: string; // 설명
  private: boolean;    // 비공개 여부
  stargazersCount: number; // 스타 수
  language: string;    // 주 언어
  owner: User;         // 소유자
  updatedAt: string;   // 마지막 업데이트
}
```

### Post (게시물)
```typescript
interface Post {
  id: string;
  user: User;
  content: {
    type: "image" | "code";  // 게시물 타입
    url?: string;            // 이미지 URL (type이 image일 경우)
    code?: string;           // 코드 내용 (type이 code일 경우)
    language?: string;       // 코드 언어 (예: "javascript")
    caption: string;         // 게시물 설명
  };
  stats: {
    likes: number;
    comments: number;
  };
  createdAt: string;         // ISO 8601 날짜 문자열
  isLiked: boolean;          // 현재 사용자가 좋아요를 눌렀는지 여부
}
```

## 3. API 명세

### 3.1 인증 (Authentication)
**NextAuth.js**와 **GitHub OAuth**를 사용하여 인증을 처리합니다.

*   **Login Flow**: Frontend에서 `signIn('github')` 호출 -> GitHub 로그인 페이지 -> Callback -> Session 생성
*   **Session**: 사용자 정보(이름, 이메일, 이미지)와 `accessToken`을 포함합니다.

### 3.2 깃허브 핵심 기능 (Core Features)
GitHub 공식 API (`https://api.github.com`)를 직접 호출하거나 Next.js API Route를 통해 프록시합니다.

#### 저장소 목록 조회
*   **Endpoint**: `GET https://api.github.com/user/repos`
*   **Headers**: `Authorization: Bearer <access_token>`

```json
[
  {
    "id": "repo_1",
    "name": "github-clone",
    "fullName": "hsm/github-clone",
    "private": false,
    "stargazersCount": 10,
    "language": "JavaScript"
  }
]
```

#### 저장소 생성
새로운 저장소를 생성합니다.
*   **Endpoint**: `POST /user/repos`
*   **Request Body**:
```json
{
  "name": "new-project",
  "description": "My awesome project",
  "private": false
}
```

### 3.3 피드 목록 조회
메인 화면에 표시될 피드 게시물 목록을 가져옵니다.

*   **Endpoint**: `GET /posts`
*   **Query Parameters**:
    *   `page` (optional): 페이지 번호 (기본값: 1)
    *   `limit` (optional): 한 번에 가져올 개수 (기본값: 10)
*   **Response (200 OK)**:
```json
{
  "data": [
    {
      "id": "post_1",
      "user": {
        "id": "user_1",
        "username": "vercel",
        "avatarUrl": "https://github.com/vercel.png"
      },
      "content": {
        "type": "image",
        "url": "https://example.com/image.png",
        "caption": "Next.js Conf is coming!"
      },
      "stats": {
        "likes": 1240,
        "comments": 45
      },
      "createdAt": "2025-12-02T10:00:00Z",
      "isLiked": false
    }
  ],
  "nextPage": 2,
  "hasNextPage": true
}
```

### 3.4 게시물 작성
새로운 게시물을 생성합니다.

*   **Endpoint**: `POST /posts`
*   **Request Body**:
```json
{
  "type": "image",
  "content": "https://example.com/image.png",
  "language": null,
  "caption": "새로운 프로젝트 시작!"
}
```
*   **Response (201 Created)**:
```json
{
  "id": "post_new_1",
  "success": true,
  "message": "게시물이 성공적으로 작성되었습니다."
}
```

### 3.5 좋아요 토글
게시물에 좋아요를 누르거나 취소합니다.

*   **Endpoint**: `POST /posts/{postId}/like`
*   **Response (200 OK)**:
```json
{
  "liked": true,
  "likesCount": 1241
}
```

### 3.6 댓글 작성
게시물에 댓글을 작성합니다.

*   **Endpoint**: `POST /posts/{postId}/comments`
*   **Request Body**:
```json
{
  "text": "정말 멋지네요!"
}
```
*   **Response (201 Created)**:
```json
{
  "id": "comment_1",
  "text": "정말 멋지네요!",
  "user": { ... },
  "createdAt": "..."
}
```

### 3.7 에러 처리 (Error Handling)
모든 API는 에러 발생 시 다음과 같은 형식을 따릅니다.

*   **Response Body**:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "입력 값이 올바르지 않습니다."
  }
}
```

*   **Common Status Codes**:
    *   `400 Bad Request`: 잘못된 요청
    *   `401 Unauthorized`: 인증 실패 (토큰 없음 또는 만료)
    *   `403 Forbidden`: 권한 없음
    *   `404 Not Found`: 리소스를 찾을 수 없음
    *   `500 Internal Server Error`: 서버 내부 오류

## 4. 프론트엔드 연동 가이드 (Next.js)

### 환경 변수 설정
`.env.local` 파일에 백엔드 API 주소를 설정합니다.
```env
NEXT_PUBLIC_API_URL=https://api.example.com/v1
```

### 데이터 Fetching 예시
```javascript
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
  headers: {
    Authorization: `Bearer ${session.accessToken}`,
  },
});
```

### 인증 헤더
모든 API 요청에는 다음과 같은 헤더를 포함해야 합니다:
```
Authorization: Bearer <access_token>
```
