const titleScreen = document.getElementById("titleScreen");
const ruleScreen = document.getElementById("ruleScreen");
const gameScreen = document.getElementById("gameScreen");

const startGameBtn = document.getElementById("startGameBtn");
const ruleBtn = document.getElementById("ruleBtn");
const backBtn = document.getElementById("backBtn");
const startBtn = document.getElementById("startBtn");
const titleBtn = document.getElementById("titleBtn");

const stageTitle = document.getElementById("stageTitle");
const enemyName = document.getElementById("enemyName");
const message = document.getElementById("message");
const result = document.getElementById("result");

let stage = 1;
let canPush = false;
let waiting = false;
let gameOver = false;
let falseStartCount = 0;
let startTime = 0;
let cpuTime = 0;

const enemies = [
    { name: "町人", min: 400, max: 500 },
    { name: "足軽", min: 350, max: 400 },
    { name: "浪人", min: 300, max: 350 },
    { name: "剣士", min: 250, max: 300 },
    { name: "剣豪", min: 200, max: 250 },
    { name: "剣聖", min: 150, max: 200 }
];

// タイトル→ルール
ruleBtn.addEventListener("click", () => {
    titleScreen.classList.add("hidden");
    ruleScreen.classList.remove("hidden");
});

// ルール→タイトル
backBtn.addEventListener("click", () => {
    ruleScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");
});

// ゲーム開始
startGameBtn.addEventListener("click", () => {

    stage = 1;
    gameOver = false;

    titleScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    loadStage();

});

// タイトルへ戻る
titleBtn.addEventListener("click", () => {

    gameScreen.classList.add("hidden");
    titleScreen.classList.remove("hidden");

});

// 戦闘開始
startBtn.addEventListener("click", () => {

    falseStartCount = 0;
    gameOver = false;

    startBtn.style.display = "none";

    startRound();

});

function loadStage()
{
    stageTitle.textContent =
        "第" + stage + "戦";

    enemyName.textContent =
        enemies[stage - 1].name;

    message.textContent =
        "開始を押せ";

    result.innerHTML = "";

    startBtn.style.display = "inline-block";
}

function startRound()
{
    message.textContent = "待て！";

    waiting = true;
    canPush = false;

    const waitTime =
        Math.floor(Math.random() * 3000) + 2000;

    setTimeout(() => {

        if(gameOver) return;

        message.textContent = "斬れ！";

        waiting = false;
        canPush = true;

        startTime = Date.now();

        const enemy = enemies[stage - 1];

        cpuTime =
            random(enemy.min, enemy.max);

    }, waitTime);
}

document.addEventListener("keydown", (e) => {

    if(e.code !== "Space")
        return;

    if(gameOver)
        return;

    // 成功
    if(canPush)
    {
        const playerTime =
            Date.now() - startTime;

        canPush = false;

        battleResult(playerTime);
    }

    // フライング
    else if(waiting)
    {
        falseStartCount++;

        if(falseStartCount === 1)
        {
            waiting = false;

            result.innerHTML =
                "フライング！<br><br>" +
                "仕切り直しだ";

            setTimeout(() => {

                if(!gameOver)
                {
                    startRound();
                }

            }, 2000);
        }
        else
        {
            gameOver = true;

            message.textContent = "失格";

            result.innerHTML =
                "焦りすぎたようだ…";

            startBtn.style.display =
                "inline-block";
        }
    }

});

function battleResult(playerTime)
{
    if(playerTime < cpuTime)
    {
        result.innerHTML =
            "あなた：" + playerTime + "ms<br>" +
            enemyName.textContent + "：" +
            cpuTime + "ms<br><br>" +
            "勝利！";

        stage++;

        if(stage > 6)
        {
            gameOver = true;

            message.textContent =
                "完全制覇！";

            result.innerHTML +=
                "<br><br>称号【剣聖】";

            return;
        }

        setTimeout(() => {

            loadStage();

        }, 5000);
    }
    else
    {
        gameOver = true;

        result.innerHTML =
            "あなた：" + playerTime + "ms<br>" +
            enemyName.textContent + "：" +
            cpuTime + "ms<br><br>" +
            "敗北…";

        message.textContent =
            "第" + stage + "戦で敗退";

        startBtn.style.display =
            "inline-block";
    }
}

function random(min, max)
{
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}