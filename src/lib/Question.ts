export interface Question {
//   id: string
  user_id: string
  question_id: string
  question: string
  options: string[]
  correct_answer: string
  user_answer?: string // 可选，因为不是所有题目都有用户答案
}
