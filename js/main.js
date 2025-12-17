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
// функция обратного вызова, которая будет вызываться при получении входящего сообщения от подключенного устройства.
terminal.onReceive((message) => {
  logToTerminal(message, 'incoming');
});

// Set a callback that will be called every time any log message is produced by the class, regardless of the log level
// set.
// Устанавливаем функцию обратного вызова, которая будет вызываться каждый раз, 
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
  // Получить имя подключенного в данный момент устройства.
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

messageForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    // Send a message to the connected device.
    // Отправить сообщение на подключенное устройство.
    await terminal.send(messageInput.value);
  } catch (error) {
                  logToTerminal(error, 'error');
                  return;
                  }

  logToTerminal(messageInput.value, 'outgoing');

  messageInput.value = '';
  messageInput.focus();
});

// Enable terminal auto-scrolling if it scrolls beyond the bottom.
// Включить автоматическую прокрутку терминала, если она выходит за нижний край.
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight - terminalContainer.offsetHeight - terminalAutoScrollingLimit;

  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
