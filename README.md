설문지 생성

mutation CreateSurvey {
createSurvey {
success
message
}
}

나의 설문지 로드

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

공개된 설문지 로드

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

나의 설문지 삭제

mutation DeleteSurvey($surveyId: String!) {
deleteSurvey(surveyId: $surveyId) {
success
message
}
}

_변수_

{
"surveyId": "d427bf46-2f50-4390-b2b5-9ab84a86dffe(예시)”
}

특정 설문지 전체 데이터 로드

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

_변수_

{
"surveyId": "d427bf46-2f50-4390-b2b5-9ab84a86dffe(예시)”
}

특정 설문지 제목 수정

mutation UpdateMySurveyTitle($surveyId: String!, $newTitle: String!) {
updateMySurveyTitle(surveyId: $surveyId, newTitle: $newTitle) {
success
message
}
}

_변수_

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"newTitle": "새로운 제목"
}

특정 설문지 설명 수정

mutation UpdateMySurveyDescription($surveyId: String!, $newDescription: String!) {
updateMySurveyDescription(surveyId: $surveyId, newDescription: $newDescription) {
success
message
}
}

_변수_

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13",
"newDescription": "새로운 설명"
}

특정 설문지 Public,Private 수정

mutation UpdateMySurveyIsPublic($surveyId: String!) {
updateMySurveyIsPublic(surveyId: $surveyId) {
success
message
}
}

_변수_

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}

특정 설문지 Public,Private boolean 확인 
mutation CheckMySurveyIsPublic($surveyId: String!) {
checkMySurveyIsPublic(surveyId: $surveyId) {
success
message
public
}
}

_변수_

{
"surveyId": "dd711659-252e-469a-907f-da8a655c4b13"
}
