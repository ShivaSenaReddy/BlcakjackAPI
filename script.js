let hitBtn = document.querySelector('.hit')
let standBtn = document.querySelector('.stand');
let dealBtn = document.querySelector('.deal')
let gameBtns = document.querySelector('.gameBtns')
let startGame = document.querySelector('.startgame')
let newGameEl = document.querySelector('.newGame')
let cardSlotPlayer = document.querySelector('.player')
let cardSlotComputer = document.querySelector('.computer')
let playerScoreEle = document.getElementById('playerScore')
let computerScoreEle = document.getElementById('computerScore')
let gameResult = document.getElementById('gameResult')
let deckId;
let winsEl = document.getElementById('wins');
let lossesEl = document.getElementById('losses');
let drawsEl = document.getElementById('draws');
let wins = 0;
let draws = 0;
let losses = 0;
let scoreObject = { 'wins': 0, 'losses': 0, 'draws': 0 };
function checkLocalStorage() {
    if (localStorage.getItem('score')) {
        scoreObject = JSON.parse(localStorage.getItem('score'))
        wins = scoreObject.wins;
        losses = scoreObject.losses;
        draws = scoreObject.draws;
        drawsEl.innerText = draws
        winsEl.innerText = wins
        lossesEl.innerText = losses
    }
    else {
        drawsEl.innerText = draws
        winsEl.innerText = wins
        lossesEl.innerText = losses
    }
}
checkLocalStorage();
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'JACK': 10, 'QUEEN': 10, 'KING': 10,
'ACE':[10,1],
}
let playerScore = 0;
let computerScore = 0;
startGame.addEventListener('click', gameStart)
async function gameStart() {
    console.log('clicked')
    await getDeckOfCards()
    if (deckId) {
        startGame.classList.toggle('hidden')
        gameBtns.classList.toggle('hidden')
    }
}
 async function getDeckOfCards() {
    const res=await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
     const data = await res.json()
    // console.log(data)
     deckId = data.deck_id;
    // console.log(deckId)
}

hitBtn.addEventListener('click', drawCard)
standBtn.addEventListener('click', () => {
   
    drawCard1()
})
function drawCard() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            playerScore = computeScore(cardSlotPlayer, playerScore, data, playerScoreEle);            
        }
        )
}

async function drawCard1() {
    while (computerScore < 15) {
        await setDelay(3)
        const res = await fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        const data = await res.json()
        if (data)
            computerScore = computeScore(cardSlotComputer, computerScore, data, computerScoreEle, true);
        console.log(computerScore)

    }
    declareWinner() 
    
}


function setDelay(i) {
    setTimeout(() => {
        console.log('yo')

    },1000*i)
}
function computeScore(ele, score, data, scoreEle, bot = false) {
    console.log(data.cards[0])
    //   console.log(data.cards[0].value, data.cards[0].image)
    ele.innerHTML += `<img src='${data.cards[0].image}' class='card'/>`
    //    console.log(cardSlotPlayer)
    if (data.cards[0].value === 'ACE') {
        let t = score;
        score += cardValues['ACE'][0];
        console.log(cardValues['ACE'][0])
        if (score > 21) {
            t += 1;
            score = t;
        }
    }
    else {
        score += cardValues[data.cards[0].value]
    }
    console.log(cardValues[data.cards[0].value], score)
    if (!bot)
        scoreEle.textContent = 'Your Score: ' + score
    else
        scoreEle.textContent = 'Bot Score: ' + score;
    if (score > 21) {
        hitBtn.disabled = true;
        if (!bot)
            scoreEle.textContent = 'You are Busted'
        else
        scoreEle.textContent = 'Bot Busted'
    }
    return score;
}

function declareWinner() {
    if ((computerScore > playerScore && computerScore <= 21) || (playerScore > 21 && computerScore<=21)) {
        console.log('you loose')
        losses++
        gameResult.innerText = 'you loose'
        lossesEl.innerText = losses;
        scoreObject.losses = losses;
       
        console.log(localStorage.getItem('score'),'local')
    }
    else if (computerScore === playerScore ||( (computerScore > 21) && (playerScore>21))) {
        console.log('tie')
        gameResult.innerText = 'tie'
      
        draws++
        drawsEl.innerText = draws
        scoreObject.draws = draws;
    }
    else if ((playerScore > computerScore && playerScore < 21) || (playerScore <= 21 && computerScore > 21)) {
        gameResult.innerText = 'you win'
        wins++
        scoreObject.wins = wins;
        winsEl.innerText = wins;
    }
    localStorage.setItem('score', JSON.stringify(scoreObject))
}

dealBtn.addEventListener('click', clearCards)
function clearCards() {
    cardSlotPlayer.innerHTML = ''
    cardSlotComputer.innerHTML = ''
    gameResult.innerText = ''
    computerScore = 0;
    playerScore = 0;
    computerScoreEle.innerText ='Computer Score: '+ 0;
    playerScoreEle.innerText = 'Your Score: ' + 0;
    hitBtn.disabled = false;
  
}

newGameEl.addEventListener('click',  ()=> {
    localStorage.removeItem('score');
    checkLocalStorage();
    clearCards();
    winsEl.innerText = 0;
    lossesEl.innerText = 0;
    drawsEl.innerText = 0;
})