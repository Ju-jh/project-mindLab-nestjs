**\_Survey**\*\*****\_****\*\*****

[ 설문지 생성 ]

mutation CreateSurvey {
createSurvey {
success
message
}
}

[ 나의 설문지 로드 ]

query GetMySurvey {
getMySurvey {
success
message
surveys {
s_id
title
}
}
}

[ 공개된 설문지 로드 ]

query GetPublicSurvey {
getPublicSurvey {
success
message
surveys {
s_id
title
}
}
}

[ 나의 설문지 삭제 ]

mutation DeleteSurvey($surveyId: String!) {
deleteSurvey(surveyId: $surveyId) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "d427bf46-2f50-4390-b2b5-9ab84a86dffe”
}

[ 특정 설문지 전체 데이터 로드 ]

mutation GetSurveyData($surveyId: String!) {
getSurveyData(surveyId: $surveyId) {
success
message
survey {
title
description
questions {
q_id
text
createdAt
options {
o_id
text
score
createdAt
}
}
}
}
}

---변수 (예시)---

{
"surveyId": "d427bf46-2f50-4390-b2b5-9ab84a86dffe”
}

[ 특정 설문지 제목 수정 ]

mutation UpdateMySurveyTitle($surveyId: String!, $newTitle: String!) {
updateMySurveyTitle(surveyId: $surveyId, newTitle: $newTitle) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"newTitle": "새로운 제목"
}

[ 특정 설문지 설명 수정 ]

mutation UpdateMySurveyDescription($surveyId: String!, $newDescription: String!) {
updateMySurveyDescription(surveyId: $surveyId, newDescription: $newDescription) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"newDescription": "새로운 설명"
}

[ 특정 설문지 Public,Private 수정 ]

mutation UpdateMySurveyIsPublic($surveyId: String!) {
updateMySurveyIsPublic(surveyId: $surveyId) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}

[ 특정 설문지 Public,Private boolean 확인 ]
mutation CheckMySurveyIsPublic($surveyId: String!) {
checkMySurveyIsPublic(surveyId: $surveyId) {
success
message
public
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}

**\_Question**\*\*****\_**\*\*\*\***

[ 특정 설문지에 문제 생성 ]

mutation CreateQuestion($surveyId: String!) {
createQuestion(surveyId: $surveyId) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}

[ 특정 설문지의 전체 문제 로드 ]

query GetAllQuestions($surveyId: String!) {
getAllQuestions(surveyId: $surveyId) {
success
message
questions {
q_id
text
options {
o_id
text
score
}
}
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}

[ 특정 문제의 제목 수정 ]

mutation UpdateQuestionText($surveyId: String!, $questionId: String!, $newText: String!) {
updateQuestionText(surveyId: $surveyId, questionId: $questionId, newText: $newText) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"questionId": "cdb7e98d-5896-4439-8730-6619f413948e",
"newText": "새로운 문제 제목입니다;"
}

[ 특정 문제 삭제 ]

mutation DeleteQuestion($surveyId: String!, $questionId: String!) {
deleteQuestion(surveyId: $surveyId, questionId: $questionId) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"questionId": "cdb7e98d-5896-4439-8730-6619f413948e"
}

**\_Option**\*\*****\_****\*\*****

[ 특정 문제에 문항 생성 ]

mutation CreateOption($surveyId: String!, $questionId: String!) {
createOption(surveyId: $surveyId, questionId: $questionId) {
success
message
}
}

---변수 (예시)---

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"questionId": "250596f2-547d-4aad-a620-496a73ea5547"
}

[ 특정 문제에 문항의 제목과 점수 수정 ]

mutation UpdateOptionTextAndScore($optionId: String!, $newText: String!, $newScore: Float!) {
updateOptionTextAndScore(optionId: $optionId, newText: $newText, newScore: $newScore) {
success
message
}
}

---변수 (예시)---

{
"optionId": "e4738984-8a1a-4ba7-b767-56068f38868a",
"newText": "새로운 문항 제목",
"newScore": 3
}

[ 특정 문제에 문항 삭제 ]

mutation DeleteOption($optionId: String!) {
deleteOption(optionId: $optionId) {
success
message
}
}

---변수 (예시)---

{
"optionId": "e4738984-8a1a-4ba7-b767-56068f38868a"
}

**\_Answer**\*\*****\_****\*\*****

[ 설문지 설문 저장 ]

mutation SaveAnswers($surveyId: String!, $answers: [AnswerInput!]!) {
saveAnswers(surveyId: $surveyId, answers: $answers) {
success
message
}
}
