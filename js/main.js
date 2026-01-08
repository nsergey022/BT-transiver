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
const defaultDeviceName = 'Нет подключения'; //имя блютуз терминала по умолчанию
const terminalAutoScrollingLimit = terminalContainer.offsetHeight / 2; //какойто лимит для прокрутки
let isTerminalAutoScrolling = true; //разрешение автопрокрутки




//----------для тестов-----------------------
//ссылка на кнопку
// const uKey1=document.getElementById('userkey1');
// let znach1 ='111\n456'
//  // при нажатии кнопки отправить сообщение те получить событие 
//  // заставляем программу «слушать» момент, когда пользователь нажмет Enter или кнопку «Отправить» внутри этой формы.
//  // async (event): Мы помечаем функцию как асинхронную, потому что внутри будем использовать await 
//  // (ждем завершения отправки данных по Bluetooth).
// uKey1.addEventListener('click',async (event) => {
//    // По умолчанию браузер перезагружает страницу после отправки формы. 
//   // Эта строка отменяет стандартное поведение, чтобы наше Bluetooth-соединение не разорвалось.
//   event.preventDefault();
//   try {
//        //Попытка Отправить сообщение на подключенное устройство.
//       // Вызываем метод send нашего класса BluetoothTerminal.
//       // Программа буквально ждет здесь, пока все пакеты данных будут переданы устройству.
//        await terminal.send(znach1); //Берем текст, который пользователь ввел в поле ввода.
//        console.log(znach1);
//   } catch (error) {
//     // Если во время отправки произошла ошибка, мы ловим её, 
//     // выводим сообщение об ошибке на экран через функцию logToTerminal и выходим из функции (return).
//                   logToTerminal(error, 'error');
//                   console.log(error, 'error');
//                   console.log(znach1);
//                   return;
//                   }
//    // Если отправка прошла успешно, 
//    // мы отображаем отправленное сообщение в нашем «терминале» на экране,
//    // помечая его как 'outgoing' (исходящее), чтобы пользователь видел историю переписки.
//   logToTerminal(znach1, 'outgoing');
//   // Стираем текст из поля ввода, чтобы оно стало пустым для следующего сообщения.
//   // Автоматически возвращаем курсор в поле ввода, чтобы пользователю не нужно было кликать по нему мышкой снова.
//   messageInput.value = '';
//   messageInput.focus();
// });


// Хранилище ваших значений как ID == userkey1 и значение =='111'
//Если вам нужно изменить команду для второй кнопки прямо в процессе работы программы,
// вы просто пишете terminalData.userkey2 = 'новое значение';
const terminalData = {
  'userkey1': '111',
  'userkey2': '222',
  'userkey3': '333',
  'specialKey': 'RESET_CMD'
};

// Эта функция будет принимать value как аргумент и выполнять всю логику с терминалом.
async function sendCommand(value) {
  if (!value) return;
     try {
         // Попытка Отправить сообщение на подключенное устройство.
         // Вызываем метод send нашего класса BluetoothTerminal.
         // Программа буквально ждет здесь, пока все пакеты данных будут переданы устройству.
         await terminal.send(value);
      } catch (error) {
                // Если во время отправки произошла ошибка, мы ловим её, 
                // выводим сообщение об ошибке на экран через функцию logToTerminal и выходим из функции (return).
                logToTerminal(error, 'error');
                console.error('Ошибка терминала:', error);
                return;
                }
   // Если отправка прошла успешно, 
   // мы отображаем отправленное сообщение в нашем «терминале» на экране,
   // помечая его как 'outgoing' (исходящее), чтобы пользователь видел историю переписки.
   console.log('Успешно отправлено:', value);
   logToTerminal(value, 'outgoing');
  // Стираем текст из поля ввода, чтобы оно стало пустым для следующего сообщения.
  // Автоматически возвращаем курсор в поле ввода, чтобы пользователю не нужно было кликать по нему мышкой снова.
  //это можно пото отключить вывод логирования
   messageInput.value = '';
   messageInput.focus();
}

// Перебираем ключи нашего объекта
Object.keys(terminalData).forEach(id => {
  const btn = document.getElementById(id);
  // console.log(btn);
  if (btn) {
      btn.addEventListener('click', async (event) => {
         // По умолчанию браузер перезагружает страницу после отправки формы. 
         // Эта строка отменяет стандартное поведение, чтобы наше Bluetooth-соединение не разорвалось.
          event.preventDefault();
         // Берем актуальное значение из объекта по ID кнопки
         const currentVal = terminalData[id]; 
         console.log(currentVal);
         // Вызываем нашу общую функцию
         await sendCommand(currentVal);
      });
  }
});

//входящее сообщение


//-------------------------------------------



//сообщение в терминал на странице
const logToTerminal = (message, type = '') => {
  //вставка ноаого div в конец существующего 
  //например: <div class="error">Error: Device must be connected to send a message</div>
  terminalContainer.insertAdjacentHTML('beforeend', `<div${type && ` class="${type}"`}>${message}</div>`);
// управление прокруткой 
//offsetHeight - видимая высота блока
//scrollHeight - высота содержимого включая и его невидимую часть

//если высота содержимого больше высоты блока то прокручиваем на величину scrollTop
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


// функция обратного вызова
// которая будет вызываться при получении входящего сообщения от подключенного устройства.
terminal.onReceive((message) => {
  logToTerminal(message, 'incoming');

// для примера 
document.querySelector('#in-txt-1').innerHTML=message; //вывод в текстовое поле #in-txt
document.querySelector('#in-txt-2').innerHTML=message; //вывод в текстовое поле #in-txt
//Метод split() разбивает строку на массив подстрок, используя указанный разделитель. {28.7?3.30?3.07}
//данные ложим в массив inDat по порядку их прихода 0 1 2 3 итд
let in_Dat =message.split("?"); // используем разделитель ? в inDat будет массив  ["знач1", "знач2", "знач3"]
console.log(in_Dat);
//можно принемать в сыром виде байтами как в примере ИИ
});


// функция обратного вызова, которая будет вызываться каждый раз, 
// когда класс генерирует какое-либо сообщение в журнале, независимо от уровня логирования.
terminal.onLog((logLevel, method, message) => {
  // Ignore debug messages.
  if (logLevel === 'debug') {
      return;
      }
  logToTerminal(message);
});


// Подключение к устройству при нажатии на кнопку Connect
// Привязываем обработчики событий к элементам пользовательского интерфейса.
connectButton.addEventListener('click', async () => {
  try {
    // Откройте в браузере средство выбора Bluetooth-устройств, чтобы выбрать устройство,
    // если оно ранее не было выбрано, установите
    // соединение с выбранным устройством и начните обмен данными.
    await terminal.connect();
  } catch (error) {
    logToTerminal(error, 'error');
    deviceNameLabel.textContent = defaultDeviceName;
    // deviceNameLabel.textContent = "MLT BT-05";
    return;
  }
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
// при отключении пишем имя по умолчанию
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
//offsetHeight - видимая высота блока
//scrollHeight - высота содержимого включая и его невидимую часть
terminalContainer.addEventListener('scroll', () => {
  const scrollTopOffset = terminalContainer.scrollHeight - terminalContainer.offsetHeight - terminalAutoScrollingLimit;
  isTerminalAutoScrolling = (scrollTopOffset < terminalContainer.scrollTop);
});
