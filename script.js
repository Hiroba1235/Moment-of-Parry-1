// ===== 要素取得 =====

const titleScreen = document.getElementById("titleScreen");
const ruleScreen = document.getElementById("ruleScreen");
const gameScreen = document.getElementById("gameScreen");

const startGameBtn = document.getElementById("startGameBtn");
const ruleBtn = document.getElementById("ruleBtn");
const backBtn = document.getElementById("backBtn");

const stageTitle = document.getElementById("stageTitle");
const enemyName = document.getElementById("enemyName");
const message = document.getElementById("message");
const result = document.getElementById("result");

const startBtn = document.getElementById("startBtn");
const slashBtn = document.getElementById("slashBtn");
const titleBtn = document.getElementById("titleBtn");

// ===== 音 =====

const startSound = new Audio("sounds/start.mp3");
const slashSound = new Audio("sounds/slash.mp3");
const defeatSound = new Audio("sounds/defeat.mp3");

// ===== ステージ =====

const enemies = [
    "町人",
    "足軽",
    "浪人",
    "剣士",
    "剣豪",
    "剣聖"
];

const cpuTimes = [
    350,
    300,
    260,
    220,
    190,
    160
];

// ===== 変数 =====

let stage = 0;
let startTime;
let canPush = false;
let gameOver = false;
let falseStartCount = 0;
let gameTimer;

// ===== タイトル =====

startGameBtn.addEventListener("click", () => {

    titleScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

});

ruleBtn.addEventListener("click", () => {

    titleScreen.classList.add("hidden");
    ruleScreen.classList.remove("hidden");

});

backBtn.addEventListener("click", () => {

    ruleScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");

});

// ===== タイトルへ戻る =====

titleBtn.addEventListener("click", () => {

    gameScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");

    stage = 0;
    falseStartCount = 0;
    gameOver = false;

    message.textContent = "開始を押せ";
    result.innerHTML = "";

    startBtn.style.display = "inline-block";

});

// ===== 開始 =====

startBtn.addEventListener("click", () => {

    stage = 0;
    falseStartCount = 0;
    gameOver = false;

    startBtn.style.display = "none";

    startSound.currentTime = 0;
    startSound.play();

    loadStage();

});

// ===== ステージ読み込み =====

function loadStage()
{
    stageTitle.textContent =
        "第" + (stage + 1) + "戦";

    enemyName.textContent =
        enemies[stage];

    result.innerHTML = "";

    startRound();
}

// ===== ラウンド開始 =====

function startRound()
{
    canPush = false;

    message.textContent = "待て！";
    result.innerHTML = "";

    clearTimeout(gameTimer);

    const waitTime =
        Math.random() * 3000 + 4000;

    gameTimer = setTimeout(() => {

        message.textContent = "斬れ！";

        startTime = Date.now();

        canPush = true;

    }, waitTime);
}

// ===== 攻撃処理 =====

function attack()
{
    if(gameOver) return;

    // フライング
    if(!canPush)
    {
        falseStartCount++;

        if(falseStartCount === 1)
        {
            result.innerHTML =
                "フライング！<br><br>" +
                "仕切り直しだ";

            clearTimeout(gameTimer);

            setTimeout(() => {

                startRound();

            }, 5000);
        }
        else
        {
            message.textContent = "失格";

            result.innerHTML =
                "焦りすぎたようだ…";

            gameOver = true;

        }

        return;
    }

    slashSound.currentTime = 0;
    slashSound.play();

    canPush = false;

    const playerTime =
        Date.now() - startTime;

    battleResult(playerTime);
}

// ===== キーボード =====

document.addEventListener("keydown", (e) => {

    if(e.code === "Space")
    {
        attack();
    }

});

// ===== スマホ =====

slashBtn.addEventListener("click", () => {

    attack();

});

// ===== 勝敗判定 =====

function battleResult(playerTime)
{
    const cpuTime = cpuTimes[stage];

    if(playerTime < cpuTime)
    {
        result.innerHTML =
            "あなた：" + playerTime + "ms<br>" +
            enemyName.textContent + "：" +
            cpuTime + "ms<br><br>" +
            "勝利！ 次の戦いへ…";

        stage++;

        if(stage >= enemies.length)
        {
            setTimeout(() => {

                message.textContent =
                    "完全制覇";

                result.innerHTML =
                    "【剣聖】の称号は君のものだ！" ;

                gameOver = true;

            }, 5000);

            return;
        }

        setTimeout(() => {

            loadStage();

        }, 5000);
    }
    else
    {
        defeatSound.currentTime = 0;
        defeatSound.play();

        message.textContent = "敗北";

        result.innerHTML =
            "あなた：" + playerTime + "ms<br>" +
            enemyName.textContent + "：" +
            cpuTime + "ms<br><br>" +
            "焦りが生んだ隙だ…";

        gameOver = true;

    }
}