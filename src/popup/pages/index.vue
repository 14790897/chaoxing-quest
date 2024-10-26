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
const isLogin = ref(false)
// 存储从内容脚本返回的数据
const questionsData = ref<any>([])
const extractAndSaveQuestionsStatus = ref('')

// 登录处理函数
async function handleLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Login error:', error.message)
    extractAndSaveQuestionsStatus.value = error.message
  } else {
    console.log('Login successful:', data.user)
    // 存储用户信息
    chrome.storage.sync.set({ userId: data.user.id })
    isLogin.value = true
  }
}

// 注册处理函数
async function handleRegister() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    console.error('Registration error:', error.message)
    extractAndSaveQuestionsStatus.value = error.message
  } else {
    console.log('Registration successful:', data.user)
    // 自动登录用户
    // handleLogin() 这是不行的，因为没有确认邮件
    // extractAndSaveQuestionsStatus.value='请在邮箱中确认注册邮件（如已确认，请忽视）'
  }
}

// 注销处理函数
async function handleLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
  } else {
    console.log('Logout successful')
    isLogin.value = false
    email.value = '' // 清除用户名
    chrome.storage.sync.set({ userId: '' })
  }
}

// 处理提取数据事件的函数
function handleExtractAndSaveQuestions() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'extractAndSaveQuestions' },
        (response) => {
          console.log('response:', response)
          if (response && response?.status === 'success') {
            if (response.data.success) {
              console.log(
                'Questions extracted and saved:',
                response.data.message
              )
              extractAndSaveQuestionsStatus.value = `Questions extracted and saved: ${response.data.message}`
            } else {
              console.error('Error:', response?.data.message || 'Unknown error')
              extractAndSaveQuestionsStatus.value = `Error: ${response?.data.message || 'Unknown error'}`
            }
          } else {
            console.error('Error:', response?.data.message || 'Unknown error')
            extractAndSaveQuestionsStatus.value = `Error: ${response?.data.message || 'Unknown error'}`
          }
        }
      )
    } else {
      console.error('No active tab identified.')
      extractAndSaveQuestionsStatus.value = 'Error: No active tab identified.'
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
  const processedData = questionBank.map((item:any) => ({
    ...item,
    options: item.options
      .map((option:any) => `${option.value}: ${option.text}`)
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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs:any) => {
    if (
      tabs[0]?.url.includes('exam') &&
      !tabs[0]?.url.includes('reVersionPaperMark')
    ) {
      handleExtractQuestionsAndFetchAnswers()
    }
  })
})

// 在组件加载时检查用户是否已登录
onMounted(async () => {
  const { userId } = await chrome.storage.sync.get('userId')
  if (userId) {
    isLogin.value = true // 用户已登录
  } else {
    isLogin.value = false // 用户未登录
  }
})
</script>

<template>
  <div class="text-center m-4 space-y-2">
    <button
      @click="handleExtractQuestionsAndFetchAnswers"
      class="btn btn-primary"
    >
      获取题目答案
    </button>

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
      class="btn btn-success mt-4"
    >
      导出题库到excel
    </button>

    <button
      @click="handleExtractAndSaveQuestions"
      class="btn btn-primary"
    >
      提取页面上的题目和答案贡献到数据库
    </button>

    <p v-if="extractAndSaveQuestionsStatus">
      {{ extractAndSaveQuestionsStatus }}
    </p>

    <div v-if="!isLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="input input-bordered w-full max-w-xs"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input input-bordered w-full max-w-xs"
      />

      <div class="flex gap-x-2 mt-2">
        <button
          @click="handleLogin"
          class="btn btn-success"
        >
          Login
        </button>
        <button
          @click="handleRegister"
          class="btn btn-warning"
        >
          Register
        </button>
      </div>
    </div>

    <div v-else>
      <p>Welcome, {{ email }}</p>
      <button
        @click="handleLogout"
        class="btn btn-error"
      >
        Logout
      </button>
    </div>

    <p>
      GIT URL:
      <a
        :href="gitURL"
        class="link link-primary"
      >
        {{ gitURL }}
      </a>
    </p>

    <p>
      GIT Commit:
      <a
        :href="gitCommitURL"
        class="link link-primary"
      >
        (#{{ gitCommit }})
      </a>
    </p>
    <p>Version: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>
    <RouterLink
      to="/common/about"
      class="link link-accent"
    >
      About
    </RouterLink>
  </div>
</template>

<style scoped>
.btn {
  @apply px-4 py-2 rounded-md text-white;
}

.logo {
  @apply h-24 p-6 transition-all filter hover:brightness-125;
}
</style>
