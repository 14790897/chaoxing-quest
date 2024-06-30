import './index.scss'
import { supabase } from '@/supabase-clients/createSupabaseStaticClient'
import type { Question } from '@/lib/Question'
import interact from 'interactjs'

const src = chrome.runtime.getURL('src/content-script/iframe/index.html')

// 创建iframe元素
const iframeHTML = `
  <div class="draggable-container">
    <div class="draggable-header">Drag me</div>
    <iframe class="crx-iframe" src="${src}"></iframe>
  </div>
`

const parser = new DOMParser()
const iframeElement = parser.parseFromString(iframeHTML, 'text/html').body
  .firstElementChild

if (iframeElement) {
  document.body.appendChild(iframeElement)

  // 获取header元素
  const header = iframeElement.querySelector('.draggable-header')
  const container = iframeElement
  if (header && container) {
    interact(header).draggable({
      listeners: {
        move(event) {
          const { target } = event
          const x =
            (parseFloat(container.getAttribute('data-x')) || 0) + event.dx
          const y =
            (parseFloat(container.getAttribute('data-y')) || 0) + event.dy
          container.style.transform = `translate(${x}px, ${y}px)`
          container.setAttribute('data-x', x.toString())
          container.setAttribute('data-y', y.toString())
        },
      },
    })
  }
}
self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}

async function extractAndSaveQuestions(): Promise<{
  success: boolean
  message: string
}> {
  const { userId } = await chrome.storage.sync.get('userId')
  if (!userId) {
    console.log('user not login')
    return {
      success: false,
      message: 'user not login',
    }
  }

  const questionsData: Question[] = []
  const questionContainers =
    document.querySelectorAll<HTMLDivElement>('div.questionLi')

  try {
    questionContainers.forEach(async (questionContainer) => {
      const questionId = questionContainer.getAttribute('data') || ''
      const questionText =
        questionContainer
          .querySelector<HTMLHeadingElement>('h3.mark_name')
          ?.textContent!.trim() || ''
      const options: { text: string; value: string }[] = []
      const optionElements =
        questionContainer.querySelectorAll<HTMLLIElement>('ul.mark_letter li')

      optionElements.forEach((optionElement, index) => {
        const optionText = optionElement.textContent!.trim().substring(2).trim() //去掉前面的序号
        const optionValue = String.fromCharCode(65 + index) // 将选项索引转换为 A, B, C, D
        options.push({ text: optionText, value: optionValue })
      })

      let correctAnswers: string[] = []
      const answerElements =
        questionContainer.querySelectorAll<HTMLSpanElement>('div.mark_key span')

      let foundCorrectAnswer = false

      answerElements.forEach((answerElement) => {
        const answerLabel = answerElement
          .querySelector<HTMLElement>('i.fontWeight')
          ?.textContent!.trim()
        if (answerLabel === '我的答案:' || answerLabel === 'My answer:') {
          // Skip user answer handling
        } else if (
          answerLabel === '正确答案:' ||
          answerLabel === 'Correct answer:'
        ) {
          const correctAnswerText = answerElement
            .textContent!.replace(/(正确答案:|Correct answer:)/, '')
            .trim()
          correctAnswers =
            correctAnswerText.length > 1
              ? correctAnswerText.split('')
              : [correctAnswerText]
          foundCorrectAnswer = true
        } else {
          console.error('Unknown answer label:', answerLabel)
        }
      })
      // 如果没有找到答案，就返回错误
      if (!foundCorrectAnswer) {
        console.error('No correct answer found for question:', questionId)
        return {
          success: false,
          message: `No correct answer found for question ID: ${questionId}`,
        }
      }
      questionsData.push({
        user_id: userId,
        question_id: questionId,
        question: questionText,
        options,
        correct_answers: correctAnswers,
      })
    })
    // 输出 JSON 格式的数据
    console.log(JSON.stringify(questionsData, null, 2))
    const { data, error } = await supabase
      .from('question_bank')
      .upsert(questionsData, {
        onConflict: ['question_id'],
        ignoreDuplicates: false,
      })

    if (error) {
      console.error('Error inserting questions:', error)
      return {
        success: false,
        message: 'Error inserting questions into database.',
      }
    } else {
      console.log('Questions inserted successfully:', data)
      return { success: true, message: 'Questions inserted successfully.' }
    }
  } catch (e) {
    console.error('Processing or Supabase error:', e)
    return {
      success: false,
      message: 'An unexpected error occurred while processing questions.',
    }
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

    optionElements.forEach((optionElement, index) => {
      const optionText =
        optionElement.querySelector('.answer_p')?.innerText.trim() || ''
      const optionValue = String.fromCharCode(65 + index) // 将索引转换为 A, B, C, D
      options.push({ text: optionText, value: optionValue })
    })

    questionsData.push({ questionText, options })
  })

  const results = []

  for (const question of questionsData) {
    // 排除前两个字的部分文本
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
          .map((answer) => {
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

        // 确保生成的选项序号对得上
        const correctOptionValues = correctOptions.map((option) => option.value)

        if (correctOptionValues.length === correctAnswers.length) {
          console.log(`Correct Options: ${correctOptionValues.join(', ')}`)
          results.push({
            question: question.questionText,
            correctAnswers: correctOptionTexts,
            correctOptions: correctOptionValues,
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
