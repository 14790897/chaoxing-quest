import './index.scss'
import { supabase } from '@/supabase-clients/createSupabaseStaticClient'
import type { Question } from '@/lib/Question'

const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

const iframe = new DOMParser().parseFromString(
  `<iframe class="crx-iframe"  style="position:fixed; top:10%; right:10%; width:300px; height:400px; z-index:9999; border:none; box-shadow:0 0 10px rgba(0,0,0,0.1); border-radius:10px;" src="${src}"></iframe>`,
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
    const options: { text: string; value: string }[] = []
    const optionElements =
      questionContainer.querySelectorAll<HTMLLIElement>('ul.mark_letter li')
    optionElements.forEach((optionElement, index) => {
      const optionText = optionElement.textContent!.trim().substring(2).trim() //去掉前面的序号
      const optionValue = String.fromCharCode(65 + index) // 将选项索引转换为 A, B, C, D
      options.push({ text: optionText, value: optionValue })
    })

    // 提取用户答案和正确答案
    let userAnswer = ''
    let correctAnswers: string[] = []
    const answerElements =
      questionContainer.querySelectorAll<HTMLSpanElement>('div.mark_key span')

    answerElements.forEach((answerElement) => {
      const answerLabel = answerElement
        .querySelector<HTMLElement>('i.fontWeight')
        ?.textContent!.trim()
      if (answerLabel === '我的答案:') {
        userAnswer = answerElement.textContent!.replace('我的答案:', '').trim()
      } else if (answerLabel === '正确答案:') {
        const correctAnswerText = answerElement
          .textContent!.replace('正确答案:', '')
          .trim()
        // 确保正确答案存储为数组格式
        correctAnswers =
          correctAnswerText.length > 1
            ? correctAnswerText.split('')
            : [correctAnswerText]
      }
    })

    // 将题目信息添加到数组
    questionsData.push({
      user_id: 'bbfdd508-da56-4d95-ac95-ba640ceb647b',
      question_id: questionId,
      question: questionText,
      options,
      correct_answers: correctAnswers,
      // user_answer: userAnswer || undefined, // 如果没有用户答案，将其设置为 undefined
    })
  })

  // 输出 JSON 格式的数据
  console.log(JSON.stringify(questionsData, null, 2))

  // 使用 Supabase 插入数据
  const { data, error } = await supabase
    .from('question_bank')
    .upsert(questionsData, {
      onConflict: ['question_id'],
      ignoreDuplicates: true, // 如果有冲突则忽略重复记录，不进行更新
    })
  if (error) {
    console.error('Error inserting questions:', error)
  } else {
    console.log('Questions inserted successfully:', data)
  }
}

// 从页面上提取题目信息并查询答案
async function extractQuestionsAndFetchAnswers() {
  const questionsData = []
  const questionContainers = document.querySelectorAll('div.questionLi')

  questionContainers.forEach((questionContainer) => {
    const questionText =
      questionContainer.querySelector('h3.mark_name div')?.innerText.trim() ||
      ''
    const options = []
    const optionElements = questionContainer.querySelectorAll(
      '.stem_answer .answerBg'
    )

    optionElements.forEach((optionElement) => {
      const optionText =
        optionElement.querySelector('.answer_p')?.innerText.trim() || ''
      const optionValue =
        optionElement.querySelector('span')?.getAttribute('data') || ''
      options.push({ text: optionText, value: optionValue })
    })

    questionsData.push({ questionText, options })
  })

  const results = []

  for (const question of questionsData) {
    // 排除前十个字的部分文本
    const partialQuestionText = question.questionText.substring(2)
    const { data, error } = await supabase
      .from('question_bank')
      .select('*')
      .ilike('question', `%${partialQuestionText}%`)

    if (error) {
      console.error(
        `Error fetching answer for question: ${question.questionText}`,
        error
      )
      results.push({
        question: question.questionText,
        correctAnswers: error.message,
      })
    } else if (data.length === 0) {
      console.error(`No answer found for question: ${question.questionText}`)
      results.push({
        question: question.questionText,
        correctAnswers: 'No answer found',
      })
    } else {
      console.log(`Question: ${question.questionText}`)
      console.log(`All matching records:`, data)

      try {
        // 只使用第一条记录进行判断
        const correctAnswers = Array.isArray(data[0].correct_answers)
          ? data[0].correct_answers
          : data[0].correct_answers.split('')

        const correctOptionTexts = correctAnswers
          .map((answer: string) => {
            const option = data[0].options.find(
              (option) => option.value === answer
            )
            if (option) {
              return option.text
            } else {
              console.error(
                `Option for answer ${answer} not found in database options`
              )
              return ''
            }
          })
          .filter((text) => text !== '')

        console.log(
          `Using the first record's correct answers: ${correctAnswers.join(', ')} - ${correctOptionTexts.join(', ')}`
        )

        // 匹配并标识正确答案
        const correctOptions = question.options.filter((option) =>
          correctOptionTexts.includes(option.text)
        )

        console.log('question.options', question.options)
        console.log('correctOptionTexts', correctOptionTexts)
        console.log('correctOptions:', correctOptions)

        if (correctOptions.length === correctOptionTexts.length) {
          console.log(
            `Correct Options: ${correctOptions.map((o) => o.value).join(', ')}`
          )
          results.push({
            question: question.questionText,
            correctAnswers: correctOptionTexts,
            correctOptions: correctOptions.map((o) => o.value),
          })
        } else {
          throw new Error('Correct answers not found in options')
        }
      } catch (matchError) {
        console.error(
          `Error matching answers for question: ${question.questionText}`,
          matchError
        )
        results.push({
          question: question.questionText,
          correctOptions: `Error matching options, showing raw answers: ${data[0].correct_answers}`,
        })
      }
    }
  }

  return results
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
  } else if (message.action === 'extractQuestionsAndFetchAnswers') {
    extractQuestionsAndFetchAnswers()
      .then((results) => {
        sendResponse({ status: 'success', data: results })
      })
      .catch((error) => {
        sendResponse({ status: 'error', error: error.message })
      })
    return true
  }
})

// // 使用 MutationObserver 监听题目文本变化
// const questionContainers = document.querySelectorAll('div.questionLi')
// questionContainers.forEach((questionContainer) => {
//   const observer = new MutationObserver(() => {
//     extractQuestionsAndFetchAnswers()
//       .then((results) => {
//         // 发送消息给背景脚本
//         chrome.runtime.sendMessage(
//           { action: 'newAnswers', data: results },
//           (response) => {
//             if (response.status === 'success') {
//               console.log('Answers sent to background script successfully.')
//             } else {
//               console.error(
//                 'Error sending answers to background script:',
//                 response.error
//               )
//             }
//           }
//         )
//       })
//       .catch((error) => {
//         console.error('Error fetching answers:', error)
//       })
//   })

//   observer.observe(questionContainer, {
//     childList: true,
//     subtree: true,
//     characterData: true,
//   })
// })
