  const consoleDiv = document.getElementById('console'); // Konsol div'i
const inputField = document.getElementById('inputField'); // Input kutusu
const sendButton = document.getElementById('sendButton'); // Gönder butonu
const clearButton = document.getElementById('clearButton'); // Clear butonu

let messageCount = 1; // Mesaj sayacı
let undoStack = []; // Geri alma yığını (Undo Stack)
let lastBackgroundColor = document.body.style.backgroundColor; // Son arka plan rengi

function logMessage(message, isTransparent = false) {
    const messageId = `Message${String(messageCount).padStart(2, '0')}`; // Message01, Message02 vb.
    let messageHTML = `<div>[${messageId}] ${message}</div>`;
    
    // Eğer mesaj saydam yapılacaksa
    if (isTransparent) {
        messageHTML = `<div style="color: rgba(255, 255, 255, 0.5); font-style: italic;">${message}</div>`;
    }

    consoleDiv.innerHTML += messageHTML;
    consoleDiv.scrollTop = consoleDiv.scrollHeight; // Otomatik kaydır
    messageCount = (messageCount % 99) + 1; // Sayaç 99'a ulaştığında 1'e dön
    
    // Undo için mesajı yığına ekleyelim
    undoStack.push({ message, isTransparent });
}

function undoLastAction() {
    // Yığındaki son mesajı geri al
    if (undoStack.length > 0) {
        undoStack.pop(); // Son eklenen mesajı yığından çıkar
        consoleDiv.innerHTML = ''; // Konsolu temizle
        // Yığındaki tüm mesajları yeniden ekle
        undoStack.forEach(item => logMessage(item.message, item.isTransparent));
        logMessage('Last action undone.', true); // Saydam geri alma mesajı
    } else {
        logMessage('No actions to undo.', true); // Geri alınacak işlem yok
    }
}

function executeCommand(command) {
    if (command === '/clear' || command === '/clearConsole') {
        consoleDiv.innerHTML = ''; // Konsolu temizle
        undoStack = []; // Geri alma yığınına da sıfırla
        logMessage('Console has been cleared.'); // Konsol temizlendi mesajı
    } else if (command === '/undo') {
        undoLastAction(); // Son değişikliği geri al
    } else if (command === '/hello') {
        logMessage('Hello, world!'); // "Hello, world!" mesajı
    } else if (command === '/time') {
        const currentTime = new Date().toLocaleTimeString();
        logMessage(`Current time: ${currentTime}`); // Şu anki saat
    } else if (command === '/date') {
        const currentDate = new Date().toLocaleDateString();
        logMessage(`Today's date: ${currentDate}`); // Bugünün tarihi
    } else if (command === '/help') {
        logMessage('Available commands: /clear, /hello, /time, /date, /random, /reverse, /uppercase, /lowercase, /roll, /clearAll, /background, /help, /undo, /echo, /reverseAll, /clearConsoleHistory, /count, /weather, /quote, /timeleft, /ascii');
    } else if (command === '/random') {
        const randomNumber = Math.floor(Math.random() * 100) + 1; // 1-100 arasında rastgele sayı
        logMessage(`Random number: ${randomNumber}`);
    } else if (command.startsWith('/reverse')) {
        const messageToReverse = command.slice(9); // Mesajı tersine çevir
        if (messageToReverse) {
            const reversedMessage = messageToReverse.split('').reverse().join('');
            logMessage(`Reversed message: ${reversedMessage}`);
        } else {
            logMessage('Please provide a message to reverse.');
        }
    } else if (command.startsWith('/uppercase')) {
        const messageToUppercase = command.slice(11); // Mesajı büyük harf yap
        if (messageToUppercase) {
            const uppercasedMessage = messageToUppercase.toUpperCase();
            logMessage(`Uppercase message: ${uppercasedMessage}`);
        } else {
            logMessage('Please provide a message to convert to uppercase.');
        }
    } else if (command.startsWith('/lowercase')) {
        const messageToLowercase = command.slice(11); // Mesajı küçük harf yap
        if (messageToLowercase) {
            const lowercasedMessage = messageToLowercase.toLowerCase();
            logMessage(`Lowercase message: ${lowercasedMessage}`);
        } else {
            logMessage('Please provide a message to convert to lowercase.');
        }
    } else if (command.startsWith('/roll')) {
        const sides = parseInt(command.slice(6)) || 6; // Zarın yüzeyi varsayılan 6, ya da kullanıcı girişi
        const rollResult = Math.floor(Math.random() * sides) + 1; // Zar atma
        logMessage(`You rolled a: ${rollResult}`);
    } else if (command === '/clearAll') {
        consoleDiv.innerHTML = ''; // Konsolu temizle
        undoStack = []; // Geri alma yığını sıfırlanır
        logMessage('All messages have been cleared.', true); // Saydam mesaj
    } else if (command.startsWith('/background')) {
        const color = command.slice(12); // Arka plan rengini al
        lastBackgroundColor = document.body.style.backgroundColor; // Eski rengi sakla
        document.body.style.backgroundColor = color; // Sayfa arka planını değiştir
        logMessage(`Background color changed to: ${color}`);
    } else if (command === '/echo') {
        const messageToEcho = command.slice(6).trim();
        if (messageToEcho) {
            logMessage(messageToEcho); // Echo mesajı
        } else {
            logMessage('Please provide a message to echo.');
        }
    } else if (command === '/reverseAll') {
        const allMessages = [...consoleDiv.children];
        allMessages.reverse().forEach(msg => {
            const reversedMessage = msg.innerHTML.split('').reverse().join('');
            logMessage(reversedMessage); // Ters mesajları yaz
        });
    } else if (command === '/clearConsoleHistory') {
        consoleDiv.innerHTML = ''; // Konsol geçmişini temizle
        logMessage('Console history cleared!');
    } else if (command === '/count') {
        logMessage(`Total messages: ${messageCount - 1}`); // Toplam mesaj sayısını göster
    } else if (command.startsWith('/weather')) {
        const city = command.slice(9).trim();
        // Bu kısmı API ile çalıştırabiliriz, şimdilik sabit bir metin ile örnek verelim
        if (city) {
            logMessage(`The weather in ${city} is 16°C with a clear sky.`);
        } else {
            logMessage('Please provide a city name for weather.');
        }
    } else if (command === '/quote') {
        const quotes = [
            `"The only limit to our realization of tomorrow is our doubts of today." - Franklin D. Roosevelt`,
            `"Life is what happens when you're busy making other plans." - John Lennon`,
            `"The purpose of our lives is to be happy." - Dalai Lama`
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        logMessage(randomQuote); // Rastgele alıntı
    } else if (command.startsWith('/timeleft')) {
        const minutes = parseInt(command.slice(9).trim());
        if (!isNaN(minutes)) {
            let secondsLeft = minutes * 60;
            const timer = setInterval(() => {
                secondsLeft--;
                logMessage(`Time left: ${Math.floor(secondsLeft / 60)}:${secondsLeft % 60}`);
                if (secondsLeft <= 0) {
                    clearInterval(timer);
                    logMessage("Time's up!");
                }
            }, 1000);
        } else {
            logMessage('Please provide a valid number of minutes.');
        }
    } else if (command.startsWith('/ascii')) {
        const text = command.slice(6).trim();
        if (text) {
            logMessage(`ASCII Art for "${text}":\n[ASCII Art Here]`);
        } else {
            logMessage('Please provide text to convert to ASCII.');
        }
    } else {
        logMessage('Unknown command. Type /help for available commands.');
    }
}

// Saydam /help mesajı ekleyelim
logMessage('/help: Type a command to see available options.', true);

// Butona tıklanınca çalışacak kod
sendButton.addEventListener('click', () => {
    const message = inputField.value.trim(); // Kullanıcı mesajı
    if (message) {
        if (message.startsWith('/')) {
            executeCommand(message); // Komut çalıştır
        } else {
            logMessage(message); // Normal mesaj yaz
        }
        inputField.value = ''; // Input'u temizle
    }
});

// Enter tuşuna basılınca mesaj gönderme
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const message = inputField.value.trim(); // Kullanıcı mesajı
        if (message) {
            if (message.startsWith('/')) {
                executeCommand(message); // Komut çalıştır
            } else {
                logMessage(message); // Normal mesaj yaz
            }
            inputField.value = ''; // Input'u temizle
        }
    }
});

// Clear butonuna tıklandığında chat'i temizle
clearButton.addEventListener('click', () => {
    consoleDiv.innerHTML = ''; // Konsolu temizle
    undoStack = []; // Geri alma yığını sıfırlanır
    logMessage('Console has been cleared.'); // Konsol temizlendi mesajı
});
