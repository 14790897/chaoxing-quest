<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import { supabase } from '@/supabase-clients/createSupabaseStaticClient';

const version = __VERSION__
const displayName = __DISPLAY_NAME__
const gitURL = __GITHUB_URL__
const gitCommit = __GIT_COMMIT__
const gitCommitURL = `${gitURL}/commit/${gitCommit}`

const store = useAppStore()

const name = computed(() => store.name)
const count = computed(() => store.count)


// 存储用户登录状态
const email = ref('');
const password = ref('');
// 登录处理函数
async function handleLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    console.error('Login error:', error.message);
  } else {
    console.log('Login successful:', data.user);
    // 存储用户信息
    store.setUserId(data.user.id);
  }
}

// 处理按钮点击事件的函数
function handleExtractAndSaveQuestions() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractAndSaveQuestions' }, (response) => {
        if (response?.status === 'success') {
          console.log('Questions extracted and saved.');
        } else {
          console.error('Error:', response?.error);
        }
      });
    }
  });
}

function handleExtractQuestionsAndFetchAnswers(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractQuestionsAndFetchAnswers' }, (response) => {
        if (response?.status === 'success') {
          console.log('Questions extracted and saved.');
        } else {
          console.error('Error:', response?.error);
        }
      });
    }
  });
}
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2">
    <h1 class="text-3xl font-bold underline pb-6">
      Hello world from Popup!
    </h1>

    <p>Vesion: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>
    <!-- 按钮触发内容脚本函数 -->
    <button @click="handleExtractAndSaveQuestions" class="bg-blue-500 text-white py-2 px-4 rounded">
      Extract and Save Questions
    </button>
    <button @click="handleExtractQuestionsAndFetchAnswers" class="bg-blue-500 text-white py-2 px-4 rounded">
      Extract Questions and Fetch Answers
    </button>

    <!-- 登录表单 -->
    <div>
      <input v-model="email" type="email" placeholder="Email" class="mb-2 p-2 border rounded" >
      <input v-model="password" type="password" placeholder="Password" class="mb-2 p-2 border rounded" >
      <button @click="handleLogin" class="bg-green-500 text-white py-2 px-4 rounded">
        Login
      </button>
    </div>
    <p>
      GIT URL:
      <a class="undeline text-green-500" :href="gitURL">
        {{ gitURL }}
      </a>
    </p>

    <p>
      GIT Commit:
      <a :href="gitCommitURL" class="text-green-500">
        (#{{ gitCommit }})
      </a>
    </p>

    <p>Name: {{ name }}</p>
    <p>Count: {{ count }}</p>

    <div class="flex gap-x-2 justify-center">
      <button class="btn btn-primary" @click="store.increment">
        Increment
      </button>
      <button class="btn btn-primary" @click="store.decrement">
        Decrement
      </button>
    </div>

    <RouterLink class="underline" to="/common/about">
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
