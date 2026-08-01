const output = document.querySelector("#agent-output");
const commandInput = document.querySelector("#agent-command");
const agentForm = document.querySelector("#agent-form");
const commandButtons = document.querySelectorAll("[data-agent-command]");
const wechatLaunch = document.querySelector("#wechat-launch");
const wechatResult = document.querySelector("#wechat-result");
const copyChecksum = document.querySelector("#copy-checksum");
const releaseChecksum = document.querySelector("#release-checksum");
const copyStatus = document.querySelector("#copy-status");

const agentReplies = {
  "/list docs": "已在授权工作区中找到 6 个文件。\n\ndocs/spec.md\ndocs/security.md\ndocs/open-model.md\n…",
  "/read README.md": "已只读打开 README.md。\n\nZeroLM 是一个在 Apple Silicon 上运行的本地 AI 产品。",
  "/search Agent": "找到 4 条匹配。\n\nsrc/zerolm/local_agent.py: 本地只读工具\nPRODUCT.md: Agent 的破坏性操作需要逐项确认",
  "/search ZeroLM": "找到 40 条匹配，已达到本次显示上限。\n\n所有结果都位于已授权工作区内。",
};

function runAgent(command) {
  const clean = command.trim();
  if (!clean) {
    output.textContent = "请输入 /list、/read 或 /search 指令。";
    return;
  }
  const destructive = /(删除|清空|rm\s|delete|erase)/i.test(clean);
  if (destructive) {
    output.textContent =
      "操作已阻止。\n\n删除、移动和覆盖默认关闭；必须在 ZeroLM 客户端中逐项预览并确认。";
    return;
  }
  output.textContent =
    agentReplies[clean] ||
    `已检查指令：${clean}\n\n这个演示只运行预设的只读操作。请在 ZeroLM 客户端中选择真实工作区。`;
}

agentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  runAgent(commandInput.value);
});

commandButtons.forEach((button) => {
  button.addEventListener("pointerdown", () => {
    button.dataset.pressed = "true";
  });
  button.addEventListener("pointerup", () => {
    delete button.dataset.pressed;
  });
  button.addEventListener("click", () => {
    const command = button.dataset.agentCommand;
    commandInput.value = command;
    runAgent(command);
  });
});

wechatLaunch?.addEventListener("click", () => {
  wechatResult.textContent =
    "正在打开 ZeroLM。请在微信中显示需要分析的对话。";
  window.location.href = "zerolm://wechat-analyze";
});

copyChecksum?.addEventListener("click", async () => {
  const checksum = releaseChecksum?.textContent?.trim();
  if (!checksum) return;

  try {
    await navigator.clipboard.writeText(checksum);
    copyStatus.textContent = "校验值已复制。";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(releaseChecksum);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "已选中校验值，请按 Command-C 复制。";
  }
});
