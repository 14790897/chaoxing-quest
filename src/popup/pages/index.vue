<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase-clients/createSupabaseStaticClient'
import * as XLSX from 'xlsx'

const version = __VERSION__
const displayName = __DISPLAY_NAME__
const gitURL = __GITHUB_URL__
const gitCommit = __GIT_COMMIT__
const gitCommitURL = `${gitURL}/commit/${gitCommit}`

// 存储用户登录状态
const email = ref('')
const password = ref('')

// 存储从内容脚本返回的数据
const questionsData = ref([])
const extractAndSaveQuestionsStatus = ref('')

// 登录处理函数
async function handleLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Login error:', error.message)
  } else {
    console.log('Login successful:', data.user)
    // 存储用户信息
    chrome.storage.sync.set({ userId: data.user.id })
  }
}

// 处理按钮点击事件的函数
function handleExtractAndSaveQuestions() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'extractAndSaveQuestions' },
        (response) => {
          if (response?.status === 'success') {
            console.log('Questions extracted and saved.')
            extractAndSaveQuestionsStatus.value =
              'Questions extracted and saved.'
          } else {
            console.error('Error:', response?.error)
            extractAndSaveQuestionsStatus.value = `Error: ${response?.error}`
          }
        }
      )
    }
  })
}

function handleExtractQuestionsAndFetchAnswers() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'extractQuestionsAndFetchAnswers' },
        (response) => {
          if (response?.status === 'success') {
            console.log('Questions extracted and fetched.', response.data)
            questionsData.value = response.data // 存储返回的数据
          } else {
            console.error('Error:', response?.error)
          }
        }
      )
    }
  })
}

// 导出题库到 Excel
async function handleExportToExcel() {
  const { data: questionBank, error } = await supabase
    .from('question_bank')
    .select('question, correct_answers,options ')
  // 检查是否有错误
  if (error) {
    console.error('Error fetching question bank:', error)
    return
  }

  // 打印 API 响应进行调试
  console.log('API Response:', { questionBank, error })
  // 检查是否有数据
  if (!questionBank || questionBank.length === 0) {
    console.error('No data found in question bank')
    return
  }
  // 将嵌套的 options 和 correct_answers 字段展开
  const processedData = questionBank.map((item) => ({
    ...item,
    options: item.options
      .map((option) => `${option.value}: ${option.text}`)
      .join(', '), // 将 options 转换为 "A: 选项1, B: 选项2" 格式
    correct_answers: item.correct_answers.join(', '), // 将 correct_answers 转换为逗号分隔的字符串
  }))

  const worksheet = XLSX.utils.json_to_sheet(processedData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions')

  XLSX.writeFile(workbook, 'questions.xlsx')
}

// 页面加载时检查 URL 并自动搜索答案
onMounted(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (
      tabs[0]?.url.includes('exam') &&
      !tabs[0]?.url.includes('reVersionPaperMark')
    ) {
      handleExtractQuestionsAndFetchAnswers()
    }
  })
})
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <button
      @click="handleExtractQuestionsAndFetchAnswers"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      Extract Questions and Fetch Answers
    </button>
    <!-- 显示返回的答案 -->
    <div v-if="questionsData.length">
      <h2 class="text-xl font-bold pt-6">Fetched Answers</h2>
      <ul>
        <li
          v-for="(item, index) in questionsData"
          :key="index"
        >
          <p>
            <strong>Question:</strong>
            {{ item.question }}
          </p>
          <p>
            <strong>Correct Answer:</strong>
            {{ item.correctAnswers }}
          </p>
          <p>
            <strong>Correct Option:</strong>
            {{ item.correctOptions }}
          </p>
        </li>
      </ul>
    </div>
    <button
      @click="handleExportToExcel"
      class="bg-green-500 text-white py-2 px-4 rounded mt-4"
    >
      Export to Excel
    </button>
    <!-- 按钮触发内容脚本函数 -->
    <button
      @click="handleExtractAndSaveQuestions"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      Extract and Save Questions
    </button>
    <div v-if="extractAndSaveQuestionsStatus">
      <p>{{ extractAndSaveQuestionsStatus }}</p>
    </div>

    <!-- 登录表单 -->
    <div>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="mb-2 p-2 border rounded"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="mb-2 p-2 border rounded"
      />
      <button
        @click="handleLogin"
        class="bg-green-500 text-white py-2 px-4 rounded"
      >
        Login
      </button>
    </div>

    <p>
      GIT URL:
      <a
        class="underline text-green-500"
        :href="gitURL"
      >
        {{ gitURL }}
      </a>
    </p>

    <p>
      GIT Commit:
      <a
        :href="gitCommitURL"
        class="text-green-500"
      >
        (#{{ gitCommit }})
      </a>
    </p>
    <p>Version: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>
    <RouterLink
      class="underline"
      to="/common/about"
    >
      About
    </RouterLink>
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md bg-blue-500 text-white;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

button {
  margin: 20px;
}
</style>
