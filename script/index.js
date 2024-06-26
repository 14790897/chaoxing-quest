(function () {
  "use strict";

  // 等待DOM加载完成
  window.addEventListener(
    "load",
    function () {
      // 创建弹出面板
      var panel = document.createElement("div");
      panel.style.position = "fixed";
      panel.style.top = "10%";
      panel.style.left = "50%";
      panel.style.transform = "translateX(-50%)";
      panel.style.backgroundColor = "#fff";
      panel.style.padding = "20px";
      panel.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      panel.style.zIndex = "1000";
      panel.style.maxHeight = "80%";
      panel.style.overflowY = "auto";
      panel.style.display = "none"; // 初始隐藏
      document.body.appendChild(panel);

      // 显示/隐藏弹出面板的按钮
      var toggleButton = document.createElement("button");
      toggleButton.innerText = "显示选项内容";
      toggleButton.style.position = "fixed";
      toggleButton.style.top = "5%";
      toggleButton.style.left = "50%";
      toggleButton.style.transform = "translateX(-50%)";
      toggleButton.style.zIndex = "1001";
      document.body.appendChild(toggleButton);

      toggleButton.addEventListener("click", function () {
        if (panel.style.display === "none") {
          panel.style.display = "block";
          toggleButton.innerText = "隐藏选项内容";
        } else {
          panel.style.display = "none";
          toggleButton.innerText = "显示选项内容";
        }
      });

      // 找到表单
      var form = document.getElementById("submitTest");
      if (form) {
        // 找到 class="stem_answer" 的 div
        var stemAnswers = form.getElementsByClassName("stem_answer");
        for (var i = 0; i < stemAnswers.length; i++) {
          var stemAnswer = stemAnswers[i];
          // 找到 .answerBg 的 div
          var answerBgDivs = stemAnswer.getElementsByClassName("answerBg");
          for (var j = 0; j < answerBgDivs.length; j++) {
            var answerBgDiv = answerBgDivs[j];
            // 提取选项内容
            var optionSpan = answerBgDiv.querySelector(
              "span.addMultipleChoice"
            );
            var optionContent = answerBgDiv.querySelector("div.answer_p");
            if (optionSpan && optionContent) {
              var content =
                "选项: " +
                optionSpan.innerText +
                " 内容: " +
                optionContent.innerText;
              console.log(content);

              // 在弹出面板中显示内容
              var p = document.createElement("p");
              p.textContent = content;
              panel.appendChild(p);
            }
          }
        }
      }
    },
    false
  );
})();



function extractQuestions() {
  // 存储所有题目信息的数组
  var questionsData = []

  // 获取所有题目容器
  var questionContainers = document.querySelectorAll('div.questionLi')

  questionContainers.forEach(function (questionContainer) {
    // 提取题目ID
    var questionId = questionContainer.getAttribute('data')

    // 提取题目文本
    var questionText = questionContainer
      .querySelector('h3.mark_name')
      .innerText.trim()

    // 提取选项
    var options = []
    var optionElements = questionContainer.querySelectorAll('ul.mark_letter li')
    optionElements.forEach(function (optionElement) {
      options.push(optionElement.innerText.trim())
    })

    // 提取用户答案和正确答案
    var userAnswer = ''
    var correctAnswer = ''
    var answerElements = questionContainer.querySelectorAll('div.mark_key span')

    answerElements.forEach(function (answerElement) {
      var answerLabel = answerElement
        .querySelector('i.fontWeight')
        .innerText.trim()
      if (answerLabel === '我的答案:') {
        userAnswer = answerElement.textContent.replace('我的答案:', '').trim()
      } else if (answerLabel === '正确答案:') {
        correctAnswer = answerElement.textContent
          .replace('正确答案:', '')
          .trim()
      }
    })

    // 将题目信息添加到数组
    questionsData.push({
      id: questionId,
      question: questionText,
      options: options,
      correctAnswer: correctAnswer,
    })
  })

  // 输出 JSON 格式的数据
  console.log(JSON.stringify(questionsData, null, 2))
}