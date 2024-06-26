import './index.scss'
import { supabase } from '@/supabase-clients/createSupabaseStaticClient'
import type { Question } from '@/lib/Question'

const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe" src="${src}"></iframe>`,
  'text/html'
).body.firstElementChild

if (iframe) {
  document.body?.append(iframe)
}

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}

async function extractAndSaveQuestions(): Promise<void> {
  // 存储所有题目信息的数组
  const questionsData: Question[] = []

  // 获取所有题目容器
  const questionContainers =
    document.querySelectorAll<HTMLDivElement>('div.questionLi')

  questionContainers.forEach((questionContainer) => {
    // 提取题目ID
    const questionId = questionContainer.getAttribute('data') || ''

    // 提取题目文本
    const questionText =
      questionContainer
        .querySelector<HTMLHeadingElement>('h3.mark_name')
        ?.textContent!.trim() || ''

    // 提取选项
    const options: string[] = []
    const optionElements =
      questionContainer.querySelectorAll<HTMLLIElement>('ul.mark_letter li')
    optionElements.forEach((optionElement) => {
      options.push(optionElement.textContent!.trim())
    })

    // 提取用户答案和正确答案
    let userAnswer = ''
    let correctAnswer = ''
    const answerElements =
      questionContainer.querySelectorAll<HTMLSpanElement>('div.mark_key span')

    answerElements.forEach((answerElement) => {
      const answerLabel = answerElement
        .querySelector<HTMLElement>('i.fontWeight')
        ?.textContent!.trim()
      if (answerLabel === '我的答案:') {
        userAnswer = answerElement.textContent!.replace('我的答案:', '').trim()
      } else if (answerLabel === '正确答案:') {
        correctAnswer = answerElement
          .textContent!.replace('正确答案:', '')
          .trim()
      }
    })

    // 将题目信息添加到数组
    questionsData.push({
      user_id: 'bbfdd508-da56-4d95-ac95-ba640ceb647b',
      question_id: questionId,
      question: questionText,
      options,
      correct_answer: correctAnswer,
      // user_answer: userAnswer || undefined, // 如果没有用户答案，将其设置为 undefined
    })
  })

  // 输出 JSON 格式的数据
  console.log(JSON.stringify(questionsData, null, 2))

  // 使用 Supabase 插入数据
  const { data, error } = await supabase
    .from('question_bank')
    .insert(questionsData)

  if (error) {
    console.error('Error inserting questions:', error)
  } else {
    console.log('Questions inserted successfully:', data)
  }
}

// 监听来自其他脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'extractAndSaveQuestions') {
    extractAndSaveQuestions()
      .then(() => {
        sendResponse({ status: 'success' })
      })
      .catch((error) => {
        sendResponse({ status: 'error', error: error.message })
      })
    return true // 使响应异步
  }
})
