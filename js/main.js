// UI elements.
// Получим ссылки на элементы UI, повесим обработчики на клик по кнопкам подключения
// и отключения и на отправку формы:
const deviceNameLabel = document.getElementById('device-name');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const terminalContainer = document.getElementById('terminal');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
// Helpers.
const defaultDeviceName = 'Web Bluetooth Terminal';
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2;
let isTerminalAutoScrolling = true;




//----------для тестов-----------------------
//ссылка на кнопку
const uKey1=document.getElementById('userkey1');
 //при нажатии кнопки отправить сообщение те получить событие 
//  Мы заставляем программу «слушать» момент, когда пользователь нажмет Enter или кнопку «Отправить» внутри этой формы.
//async (event): Мы помечаем функцию как асинхронную, потому что внутри будем использовать await 
//(ждем завершения отправки данных по Bluetooth).
        //при нажатии на кнопку передаем ее значение value зделать функцию универсальную для любой кнопки и любых
        //данных как аргумент функции
uKey1.addEventListener('click', async (event) => {
  // По умолчанию браузер перезагружает страницу после отправки формы. 
  // Эта строка отменяет стандартное поведение, чтобы наше Bluetooth-соединение не разорвалось.
  event.preventDefault();
  try {
       //Попытка Отправить сообщение на подключенное устройство.
      // Вызываем метод send нашего класса BluetoothTerminal.
      // Программа буквально ждет здесь, пока все пакеты данных будут переданы устройству.
       await terminal.send(uKey1.value); //Берем текст, который пользователь ввел в поле ввода.
       console.log(uKey1.value);
  } catch (error) {
    // Если во время отправки произошла ошибка, мы ловим её, 
    // выводим сообщение об ошибке на экран через функцию logToTerminal и выходим из функции (return).
                  logToTerminal(error, 'error');
                  console.log(error, 'error');
                  return;
                  }
   // Если отправка прошла успешно, мы отображаем отправленное сообщение в нашем «терминале» на экране,
   // помечая его как 'outgoing' (исходящее), чтобы пользователь видел историю переписки.
  logToTerminal(uKey1.value, 'outgoing');
  // Стираем текст из поля ввода, чтобы оно стало пустым для следующего сообщения.
  // Автоматически возвращаем курсор в поле ввода, чтобы пользователю не нужно было кликать по нему мышкой снова.
  // messageInput.value = '';
  // messageInput.focus();
});

//входящее сообщение


//-------------------------------------------



//сообщение в терминал на странице
const logToTerminal = (message, type = '') => {
  terminalContainer.insertAdjacentHTML('beforeend', `<div${type && ` class="${type}"`}>${message}</div>`);

  if (isTerminalAutoScrolling) {
    const scrollTop = terminalContainer.scrollHeight - terminalContainer.offsetHeight;

    if (scrollTop > 0) {
      terminalContainer.scrollTop = scrollTop;
    }
  }
};

// Create a BluetoothTerminal instance with the default configuration. BluetoothTerminal
// Создаем экземпляр BluetoothTerminal с конфигурацией по умолчанию. BluetoothTerminal
const terminal = new BluetoothTerminal({
  // serviceUuid: 0xFFE0,
  // characteristicUuid: 0xFFE1,
  // characteristicValueSize: 20,
  // receiveSeparator: '\n',
  // sendSeparator: '\n',
  // logLevel: 'log',
});

// Set a callback that will be called when an incoming message from the connected device is received.
// функция обратного вызова
// которая будет вызываться при получении входящего сообщения от подключенного устройства.
terminal.onReceive((message) => {
  document.querySelector('#in-txt').innerHTML=message;
  logToTerminal(message, 'incoming');
});

// Set a callback that will be called every time any log message is produced by the class, regardless of the log level
// set.
// функция обратного вызова, которая будет вызываться каждый раз, 
// когда класс генерирует какое-либо сообщение в журнале, независимо от уровня логирования.
terminal.onLog((logLevel, method, message) => {
  // Ignore debug messages.
  if (logLevel === 'debug') {
      return;
      }
  logToTerminal(message);
});

// Bind event listeners to the UI elements.
// Подключение к устройству при нажатии на кнопку Connect
// Привязываем обработчики событий к элементам пользовательского интерфейса.
connectButton.addEventListener('click', async () => {
  try {
    // Open the browser Bluetooth device picker to select a device if none was previously selected, establish a
    // connection with the selected device, and initiate communication.
    // Откройте в браузере средство выбора Bluetooth-устройств, чтобы выбрать устройство,
    // если оно ранее не было выбрано, установите
    // соединение с выбранным устройством и начните обмен данными.
    await terminal.connect();
  } catch (error) {
    logToTerminal(error, 'error');
    return;
  }

  // Retrieve the name of the currently connected device.
  // Получить имя подключенного в данный момент устройства. или по умолчанию
  deviceNameLabel.textContent = terminal.getDeviceName() || defaultDeviceName;
});

// Отключение от устройства при нажатии на кнопку Disconnect
disconnectButton.addEventListener('click', () => {
  try {
    // Disconnect from the currently connected device and clean up associated resources.
    // Отключитесь от подключенного устройства и очистите связанные с ним ресурсы.
    terminal.disconnect();
  } catch (error) {
                  logToTerminal(error, 'error');

                  return;
                  }

  deviceNameLabel.textContent = defaultDeviceName;
});

 //при нажатии кнопки отправить сообщение те получить событие 
//  Мы заставляем программу «слушать» момент, когда пользователь нажмет Enter или кнопку «Отправить» внутри этой формы.
//async (event): Мы помечаем функцию как асинхронную, потому что внутри будем использовать await 
//(ждем завершения отправки данных по Bluetooth).
messageForm.addEventListener('submit', async (event) => {
  // По умолчанию браузер перезагружает страницу после отправки формы. 
  // Эта строка отменяет стандартное поведение, чтобы наше Bluetooth-соединение не разорвалось.
  event.preventDefault();
  try {
       //Попытка Отправить сообщение на подключенное устройство.
      //  Вызываем метод send нашего класса BluetoothTerminal.
      //  Программа буквально ждет здесь, пока все пакеты данных будут переданы устройству.
       await terminal.send(messageInput.value); //Берем текст, который пользователь ввел в поле ввода.
  } catch (error) {
    // Если во время отправки произошла ошибка, мы ловим её, 
    // выводим сообщение об ошибке на экран через функцию logToTerminal и выходим из функции (return).
                  logToTerminal(error, 'error');
                  return;
                  }
   // Если отправка прошла успешно, мы отображаем отправленное сообщение в нашем «терминале» на экране,
   // помечая его как 'outgoing' (исходящее), чтобы пользователь видел историю переписки.
  logToTerminal(messageInput.value, 'outgoing');
  // Стираем текст из поля ввода, чтобы оно стало пустым для следующего сообщения.
  // Автоматически возвращаем курсор в поле ввода, чтобы пользователю не нужно было кликать по нему мышкой снова.
  messageInput.value = '';
  messageInput.focus();
});

// Enable terminal auto-scrolling if it scrolls beyond the bottom.
// Включить автоматическую прокрутку терминала, если она выходит за нижний край.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight - terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
