let player = {
    name: "Per",
    chips: 200
}
let cards = []
let dealerCards = []
let sum = 0
let dealerSum = 0
let hasBlackJack = false
let isAlive = false
let gameInProgress = false
let message = ""
let betAmount = 10

let cardsEl = document.getElementById("cards-el")
let dealerCardsEl = document.getElementById("dealer-cards-el")
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let dealerSumEl = document.getElementById("dealer-sum-el")
let playerEl = document.getElementById("player-el")
let betEl = document.getElementById("bet-el")

function updatePlayerInfo() {
    playerEl.textContent = player.name + ": $" + player.chips
    betEl.textContent = "Current bet: $" + betAmount
}

function getRandomCard() {
    let randomNumber = Math.floor(Math.random() * 13) + 1

    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

function startGame() {
    if (!gameInProgress && player.chips >= betAmount) {
        isAlive = true
        hasBlackJack = false
        gameInProgress = true

        let firstCard = getRandomCard()
        let secondCard = getRandomCard()
        cards = [firstCard, secondCard]
        sum = firstCard + secondCard

        checkForAces()

        let dealerFirstCard = getRandomCard()
        let dealerSecondCard = getRandomCard()
        dealerCards = [dealerFirstCard, dealerSecondCard]
        dealerSum = dealerFirstCard + dealerSecondCard

        renderGame()

        if (sum === 21) {
            hasBlackJack = true
            stand()
        }
    } else if (player.chips < betAmount) {
        messageEl.textContent = "Not enough chips! Reset game to continue."
    }
}

function checkForAces() {
    for (let i = 0; i < cards.length; i++) {
        if (sum > 21 && cards[i] === 11) {
            cards[i] = 1
            sum -= 10
        }
    }
}

function checkForDealerAces() {
    for (let i = 0; i < dealerCards.length; i++) {
        if (dealerSum > 21 && dealerCards[i] === 11) {
            dealerCards[i] = 1
            dealerSum -= 10
        }
    }
}

function renderGame() {
    cardsEl.textContent = "Your Cards: "
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }
    sumEl.textContent = "Your Sum: " + sum

    dealerCardsEl.textContent = "Dealer Cards: "
    if (!gameInProgress) {
        for (let i = 0; i < dealerCards.length; i++) {
            dealerCardsEl.textContent += dealerCards[i] + " "
        }
    } else {
        dealerCardsEl.textContent += dealerCards[0] + " ? "
    }
    dealerSumEl.textContent = gameInProgress ? "Dealer Sum: ?" : "Dealer Sum: " + dealerSum

    if (gameInProgress) {
        if (sum <= 20) {
            message = "Do you want to draw a new card?"
        } else if (sum === 21) {
            message = "You've got Blackjack!"
            hasBlackJack = true
        } else {
            message = "Bust! You're out of the game!"
            isAlive = false
            endGame()
        }
    }

    messageEl.textContent = message
    updatePlayerInfo()
}

function newCard() {
    if (isAlive && gameInProgress && !hasBlackJack) {
        let card = getRandomCard()
        sum += card
        cards.push(card)

        checkForAces()
        renderGame()
    }
}

function stand() {
    if (isAlive && gameInProgress) {
        gameInProgress = false

        while (dealerSum < 17) {
            let card = getRandomCard()
            dealerCards.push(card)
            dealerSum += card
            checkForDealerAces()
        }

        determineWinner()
    }
}

function determineWinner() {
    if (!isAlive) {
        message = "You bust! Dealer wins."
        player.chips -= betAmount
    } else if (dealerSum > 21) {
        message = "Dealer bust! You win!"
        player.chips += betAmount
    } else if (sum > dealerSum) {
        message = "You win!"
        player.chips += betAmount
    } else if (sum < dealerSum) {
        message = "Dealer wins!"
        player.chips -= betAmount
    } else {
        message = "It's a tie!"
    }

    if (hasBlackJack && sum > dealerSum) {
        message = "Blackjack! You win 1.5x your bet!"
        player.chips += Math.floor(betAmount * 0.5)
    }

    messageEl.textContent = message
    updatePlayerInfo()
    renderGame()

    if (player.chips <= 0) {
        messageEl.textContent = "Game over! You're out of chips. Reset to play again."
    }
}

function endGame() {
    gameInProgress = false
    stand()
}

function resetGame() {
    player.chips = 200
    betAmount = 10
    cards = []
    dealerCards = []
    sum = 0
    dealerSum = 0
    hasBlackJack = false
    isAlive = false
    gameInProgress = false
    message = "Want to play a round?"
    messageEl.textContent = message
    cardsEl.textContent = "Your Cards:"
    dealerCardsEl.textContent = "Dealer Cards:"
    sumEl.textContent = "Your Sum:"
    dealerSumEl.textContent = "Dealer Sum:"
    updatePlayerInfo()
}

function changeBet(amount) {
    if (!gameInProgress) {
        betAmount = Math.max(5, Math.min(100, betAmount + amount))
        updatePlayerInfo()
    }
}

updatePlayerInfo()