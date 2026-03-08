export type RoleType = "The Storyteller" | "The Guide" | "The Builder" | "The Explorer";

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    roleValue: RoleType;
  }[];
}

export const DEV_ROLES: Record<RoleType, { title: string; description: string; color: string }> = {
  "The Storyteller": {
    title: "스토리텔러",
    description: "코드를 통해 이야기를 전달합니다. 뛰어난 문서화, 기술 블로그, 발표를 통해 복잡한 아이디어를 커뮤니티가 이해하기 쉽게 만듭니다.",
    color: "from-blue-500 to-indigo-500",
  },
  "The Guide": {
    title: "가이드",
    description: "모두가 원하는 멘토입니다. PR 리뷰, 커뮤니티 질문 답변, 주니어 개발자들의 성장을 돕는 데 에너지를 씁니다.",
    color: "from-emerald-500 to-teal-500",
  },
  "The Builder": {
    title: "빌더",
    description: "결과물로 대화합니다. 오픈 소스 라이브러리, 사이드 프로젝트, 유용한 도구들을 직접 만들어 동료들의 문제를 해결합니다.",
    color: "from-orange-500 to-amber-500",
  },
  "The Explorer": {
    title: "익스플로러",
    description: "항상 최첨단에 서 있습니다. 새로운 프레임워크와 베타 버전을 누구보다 먼저 테스트하고 지도를 그려 커뮤니티가 안전하게 따라올 수 있게 합니다.",
    color: "from-purple-500 to-fuchsia-500",
  }
};

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "새로운 프레임워크를 배울 때, 당신의 첫 번째 행동은?",
    options: [
      { text: "빠르게 '시작하기' 블로그 포스트를 작성한다.", roleValue: "The Storyteller" },
      { text: "프레임워크 커뮤니티에서 다른 사람들의 질문을 돕는다.", roleValue: "The Guide" },
      { text: "다음 프로젝트에 바로 쓸 수 있는 템플릿을 만든다.", roleValue: "The Builder" },
      { text: "내부 코드를 뜯어보며 동작 원리를 파헤친다.", roleValue: "The Explorer" },
    ]
  },
  {
    id: 2,
    text: "주니어 개발자가 복잡한 아키텍처 질문을 올렸다면?",
    options: [
      { text: "개념을 잘 설명해둔 심층 아티클 링크를 공유해준다.", roleValue: "The Storyteller" },
      { text: "잠깐 시간을 내어 페어 프로그래밍으로 직접 설명해준다.", roleValue: "The Guide" },
      { text: "해결 방법을 보여주는 간단한 예제 코드를 짜서 준다.", roleValue: "The Builder" },
      { text: "세 가지 최신 접근 방식의 장단점을 비교해서 제안한다.", roleValue: "The Explorer" },
    ]
  },
  {
    id: 3,
    text: "금요일 오후, 4시간의 자유 시간이 생겼다면 무엇을 할까요?",
    options: [
      { text: "팀 메인 레포지토리의 README를 깔끔하게 정리한다.", roleValue: "The Storyteller" },
      { text: "동료들과 1:1 커피챗을 하며 고민을 들어준다.", roleValue: "The Guide" },
      { text: "생각해두었던 작고 유용한 CLI 도구를 배포한다.", roleValue: "The Builder" },
      { text: "사람들이 트위터에서 떠드는 생소한 새 엔진을 써본다.", roleValue: "The Explorer" },
    ]
  },
  {
    id: 4,
    text: "오픈 소스 프로젝트에 기여할 때 선호하는 방식은?",
    options: [
      { text: "오타 수정, 문서 개선 및 튜토리얼 추가.", roleValue: "The Storyteller" },
      { text: "이슈 분류 및 버그 리포트 재현 테스트.", roleValue: "The Guide" },
      { text: "많은 요청이 있었던 핵심 기능을 구현해서 제출.", roleValue: "The Builder" },
      { text: "더 빠르고 새로운 번들러로 빌드 시스템 리팩토링.", roleValue: "The Explorer" },
    ]
  },
  {
    id: 5,
    text: "개발 커리어에서 가장 큰 만족감을 느낄 때는?",
    options: [
      { text: "내가 만든 콘텐츠로 누군가 개념을 이해했을 때.", roleValue: "The Storyteller" },
      { text: "내가 멘토링한 개발자가 승진하거나 성장했을 때.", roleValue: "The Guide" },
      { text: "내가 만든 패키지의 주간 다운로드 수가 폭증할 때.", roleValue: "The Builder" },
      { text: "성능을 최적화하는 완전히 새로운 방법을 찾아냈을 때.", roleValue: "The Explorer" },
    ]
  }
];

export function calculateResult(answers: RoleType[]): RoleType {
  const counts = answers.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  let maxRole: RoleType = "The Builder";
  let maxCount = 0;

  for (const [role, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxRole = role as RoleType;
    }
  }

  return maxRole;
}
