/**
 * BluetoothTerminal class.
 * Класс BluetoothTerminal.
 */
 class BluetoothTerminal {
    /**
     * Creates a BluetoothTerminal instance with the provided configuration.
     * Supports both options object (preferred) and individual parameters (deprecated and will be removed in v2.0.0).
     * @param [optionsOrServiceUuid]  Optional options object or service UUID as an integer (16-bit or 32-bit) or a
     *                                  string (128-bit UUID)
     * @param [characteristicUuid]    Optional characteristic UUID as an integer (16-bit or 32-bit) or a string (128-bit
     *                                  UUID)
     * @param [receiveSeparator]      Optional receive separator with length equal to one character
     * @param [sendSeparator]         Optional send separator with length equal to one character
     * @param [onConnectCallback]     Optional callback for successful connection
     * @param [onDisconnectCallback]  Optional callback for disconnection
     */

/**
* Создает экземпляр BluetoothTerminal с предоставленной конфигурацией.
* Поддерживает как объект параметров (предпочтительный), так и отдельные параметры (устарело и будет удалено в версии 2.0.0).
* @param [optionsOrServiceUuid] Необязательный объект параметров или UUID службы в виде целого числа (16-бит или 32-бит) или
* строки (128-битный UUID)
* @param [characteristicUuid] Необязательный UUID характеристики в виде целого числа (16-бит или 32-бит) или строки (128-битный UUID)
* @param [receiveSeparator] Необязательный разделитель приема длиной в один символ
* @param [sendSeparator] Необязательный разделитель отправки длиной в один символ
* @param [onConnectCallback] Необязательная функция обратного вызова при успешном подключении
* @param [onDisconnectCallback] Необязательная функция обратного вызова при отключении
*/
    constructor(optionsOrServiceUuid, characteristicUuid,
    // @deprecated
    receiveSeparator,
    // @deprecated
    sendSeparator,
    // @deprecated
    onConnectCallback,
    // @deprecated
    onDisconnectCallback // @deprecated
    ) {
      // Event listeners bound to this instance to maintain the correct context.
      // Обработчики событий, привязанные к этому экземпляру, поддерживают правильный контекст.
      this._boundCharacteristicValueChangedListener = void 0;
      this._boundGattServerDisconnectedListener = void 0;
      // Private properties configurable via setters.
      // Приватные свойства, настраиваемые с помощью сеттеров.
      this._serviceUuid = 0xFFE0;
      this._characteristicUuid = 0xFFE1;
      this._characteristicValueSize = 20;
      this._receiveSeparator = '\n';
      this._sendSeparator = '\n';
      this._onConnectCallback = null;
      this._onDisconnectCallback = null;
      this._onReceiveCallback = null;
      this._onLogCallback = null;
      this._logLevel = 'log';
      // Current Bluetooth device object.
      // Текущий объект Bluetooth-устройства.
      this._device = null;
      // Current Bluetooth characteristic object.
      // Текущий объект характеристики Bluetooth.
      this._characteristic = null;
      // Buffer that accumulates incoming characteristic value until a separator character is received.
      // Буфер, в котором накапливаются входящие значения характеристик до тех пор, пока не будет получен разделительный символ.
      this._receiveBuffer = '';
      // Bind event listeners to preserve 'this' context when called by the event system.
      // Привязываем обработчики событий, чтобы сохранить контекст 'this' при вызове системой событий.
      this._boundCharacteristicValueChangedListener = this._characteristicValueChangedListener.bind(this);
      this._boundGattServerDisconnectedListener = this._gattServerDisconnectedListener.bind(this);
      this._logDebug('constructor', 'BluetoothTerminal instance initialized');
      if (typeof optionsOrServiceUuid === 'object') {
            const options = optionsOrServiceUuid;
            if (options.serviceUuid !== undefined) {
                this.setServiceUuid(options.serviceUuid);
                }
            if (options.characteristicUuid !== undefined) {
               this.setCharacteristicUuid(options.characteristicUuid);
               }
            if (options.characteristicValueSize !== undefined) {
               this.setCharacteristicValueSize(options.characteristicValueSize);
               }
            if (options.receiveSeparator !== undefined) {
              this.setReceiveSeparator(options.receiveSeparator);
              }
            if (options.sendSeparator !== undefined) {
              this.setSendSeparator(options.sendSeparator);
              }
            if (options.onConnectCallback !== undefined) {
              this.onConnect(options.onConnectCallback);
              }
            if (options.onDisconnectCallback !== undefined) {
              this.onDisconnect(options.onDisconnectCallback);
              }
            if (options.onReceiveCallback !== undefined) {
              this.onReceive(options.onReceiveCallback);
              }
            if (options.onLogCallback !== undefined) {
              this.onLog(options.onLogCallback);
              }
            if (options.logLevel !== undefined) {
              this.setLogLevel(options.logLevel);
              }
      } else {
               // @deprecated
              if (optionsOrServiceUuid !== undefined) {
                this.setServiceUuid(optionsOrServiceUuid);
                }
              if (characteristicUuid !== undefined) {
                this.setCharacteristicUuid(characteristicUuid);
                }
              if (receiveSeparator !== undefined) {
                this.setReceiveSeparator(receiveSeparator);
                }
              if (sendSeparator !== undefined) {
                this.setSendSeparator(sendSeparator);
                }
              if (onConnectCallback !== undefined) {
                this.onConnect(onConnectCallback);
                }
              if (onDisconnectCallback !== undefined) {
                this.onDisconnect(onDisconnectCallback);
                }
              }
    }
  
    /**
     * Sets integer or string representing service UUID used.
     * @param uuid Service UUID as an integer (16-bit or 32-bit) or a string (128-bit UUID)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/BluetoothUUID
     * 
     * Задает целое число или строку, представляющую используемый UUID службы.
     * @param uuid UUID сервиса в виде целого числа (16-битное или 32-битное) или строки (128-битный UUID)
     */
    setServiceUuid(uuid) {
       //если не число и не строка
      if (!Number.isInteger(uuid) && typeof uuid !== 'string') {
           throw new Error('Service UUID must be either an integer or a string');
          }
          //если равно 0
      if (uuid === 0) {
          throw new Error('Service UUID cannot be zero');
          }
          //если строка но она пустая
      if (typeof uuid === 'string' && uuid.trim() === '') {
          throw new Error('Service UUID cannot be an empty string');
          }
        
      this._serviceUuid = uuid; //присваиваем значение сервиса UUID
      this._logDebug('setServiceUuid', `Service UUID set to "${uuid}"`);
    }
  
    /**
     * Sets integer or string representing characteristic UUID used.
     * @param uuid Characteristic UUID as an integer (16-bit or 32-bit) or a string (128-bit UUID)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/BluetoothUUID
     * Задает целое число или строку, представляющую используемый UUID характеристики.
     */
    setCharacteristicUuid(uuid) {
        //если не число и не строка
      if (!Number.isInteger(uuid) && typeof uuid !== 'string') {
        throw new Error('Characteristic UUID must be either an integer or a string');
        }
        //если равно 0
      if (uuid === 0) {
        throw new Error('Characteristic UUID cannot be zero');
        }
      //если строка но она пустая
      if (typeof uuid === 'string' && uuid.trim() === '') {
        throw new Error('Characteristic UUID cannot be an empty string');
        }

      this._characteristicUuid = uuid; //присваиваем значение характеристики UUID
      this._logDebug('setCharacteristicUuid', `Characteristic UUID set to "${uuid}"`);
    }
  
    /**
     * Sets the maximum size (in bytes) for each characteristic write operation. Larger messages will be automatically
     * split into chunks of this size.
     * @param size Maximum characteristic value size in bytes (positive integer)
     *
     * Задает максимальный размер (в байтах) для каждой операции записи характеристики. 
     * Более крупные сообщения будут автоматически
     * разбиты на фрагменты этого размера.
     * @param size Максимальный размер значения характеристики в байтах (положительное целое число)
     */
    setCharacteristicValueSize(size) {
      if (!Number.isInteger(size) || size <= 0) {
        throw new Error('Characteristic value size must be a positive integer');
        }
      this._characteristicValueSize = size;
      this._logDebug('setCharacteristicValueSize', `Characteristic value size set to "${size}"`);
    }
  
    /**
     * Sets character representing separator for messages received from the connected device, end of line for example.
     * @param separator Receive separator with length equal to one character
     *
     * Устанавливает символ, представляющий разделитель для сообщений, получаемых от подключенного устройства, например,
     *  конец строки.
     * @param separator Разделитель для получаемых сообщений длиной в один символ
     */
    setReceiveSeparator(separator) {
      //проверка  если это не строка
      if (typeof separator !== 'string') {
        throw new Error('Receive separator must be a string');
        }
        // проверка если больше чем один символ
      if (separator.length !== 1) {
        throw new Error('Receive separator length must be equal to one character');
      }
      this._receiveSeparator = separator;
      this._logDebug('setReceiveSeparator', `Receive separator set to "${separator}"`);
    }
  
    /**
     * Sets character representing separator for messages sent to the connected device, end of line for example.
     * @param separator Send separator with length equal to one character
     * 
     * Задает символ, представляющий собой разделитель для сообщений, отправляемых на подключенное устройство,
     *  например, конец строки.
     * @param separator Указывает разделитель длиной в один символ
     */
    setSendSeparator(separator) {
      if (typeof separator !== 'string') {
        throw new Error('Send separator must be a string');  //немедленый вывод ошибки если не строка
      }
      if (separator.length !== 1) {
        throw new Error('Send separator length must be equal to one character'); //немедленый вывод ошибки если больше 1-го символа
      }
      this._sendSeparator = separator;
      this._logDebug('setSendSeparator', `Send separator set to "${separator}"`);
    }
  
    /**
     * Sets a callback that will be called after the device is fully connected and communication has started.
     * @deprecated Use `onConnect()` instead.
     * @param [callback] Callback for successful connection; omit or pass null/undefined to remove
     */
     
    /**
      * Устанавливает функцию обратного вызова, которая будет вызвана после полного подключения устройства и начала обмена данными.
      * @deprecated Используйте `onConnect()` вместо этого.
      * @param [callback] Функция обратного вызова для успешного подключения; опустите или передайте null/undefined, чтобы удалить.
      */
    setOnConnected(callback) {
      this.onConnect(callback);
    }
  
    /** 
     * Sets a callback that will be called after the device is fully connected and communication has started.
     * @param [callback] Callback for successful connection; omit or pass null/undefined to remove
     * 
    */
     
    /**
     * функция обратного вызова, которая будет вызвана после полного подключения устройства и 
     * начала обмена данными.
     * @param [callback] Функция обратного вызова для успешного подключения; опустите или передайте null/undefined, чтобы удалить
     */
    onConnect(callback) {
      this._onConnectCallback = callback || null;
      this._logDebug('onConnect', `onConnect callback ${this._onConnectCallback === null ? 'removed' : 'set'}`);
    }
  
    /**
     * Sets a callback that will be called after the device is disconnected.
     * @deprecated Use `onDisconnect()` instead.
     * @param [callback] Callback for disconnection; omit or pass null/undefined to remove
     */
    
    /**
     * функция обратного вызова, которая будет вызвана после отключения устройства. 
     * @deprecated Используйте `onDisconnect()` вместо этого.
     * @param [callback] Функция обратного вызова для отключения; опустите или передайте null/undefined, чтобы удалить
     */
    setOnDisconnected(callback) {
      this.onDisconnect(callback);
    }
  
    /**
     * Sets a callback that will be called after the device is disconnected.
     * @param [callback] Callback for disconnection; omit or pass null/undefined to remove
     */

    /**
    * Устанавливает функцию обратного вызова, которая будет вызвана после отключения устройства.
    * @param [callback] Функция обратного вызова для отключения; опустите или передайте null/undefined, чтобы удалить.
    */
    onDisconnect(callback) {
      this._onDisconnectCallback = callback || null;
      this._logDebug('onDisconnect', `onDisconnect callback ${this._onDisconnectCallback === null ? 'removed' : 'set'}`);
    }
  
    /**
     * Sets a callback that will be called when an incoming message from the connected device is received.
     * @param [callback] Callback for incoming message; omit or pass null/undefined to remove
     */
    /**
      * функция обратного вызова, которая будет вызываться при получении входящего сообщения от подключенного устройства.
      * @param [callback] Функция обратного вызова для входящего сообщения; опустите или передайте null/undefined, чтобы удалить.
      */
    onReceive(callback) {
      this._onReceiveCallback = callback || null;
      this._logDebug('onReceive', `onReceive callback ${this._onReceiveCallback === null ? 'removed' : 'set'}`);
    }
  
    /**
     * Sets a callback that will be called every time any log message is produced by the class, regardless of the log
     * level set.
     * @param [callback] Callback for log messages; omit or pass null/undefined to remove
     */
    /**
      * Устанавливает функцию обратного вызова, которая будет вызываться каждый раз, когда класс генерирует какое-либо сообщение в журнале, независимо от установленного уровня логирования.
      * @param [callback] Функция обратного вызова для сообщений журнала; опустите или передайте null/undefined, чтобы удалить
    */
    onLog(callback) {
      this._onLogCallback = callback || null;
      this._logDebug('onLog', `onLog callback ${this._onLogCallback === null ? 'removed' : 'set'}`);
    }
  
    /**
     * Sets the log level that controls which messages are displayed in the console. The level hierarchy (from least to
     * most verbose) is: "none", "error", "warn", "info", "log", "debug". Each level includes all less verbose levels.
     * @param logLevel Log level as a string ("none", "error", "warn", "info", "log", or "debug")
     */
    /**
      * Устанавливает уровень логирования, определяющий, какие сообщения отображаются в консоли. Иерархия уровней (от наименее подробного до
      * наиболее подробного) следующая: "none", "error", "warn", "info", "log", "debug". Каждый уровень включает все менее подробные уровни.
      * @param logLevel Уровень логирования в виде строки ("none", "error", "warn", "info", "log" или "debug")
      */
    setLogLevel(logLevel) {
      if (typeof logLevel !== 'string') {
        throw new Error('Log level must be a string'); //«Уровень логирования должен быть строкой».
      }
      if (!BluetoothTerminal._logLevels.includes(logLevel)) {
        throw new Error(`Log level must be one of: "${BluetoothTerminal._logLevels.join('", "')}"`);
      }
      this._logLevel = logLevel;
      this._logDebug('setLogLevel', `Log level set to "${logLevel}"`);
    }
  
    /**
     * Opens the browser Bluetooth device picker to select a device if none was previously selected, establishes
     * a connection with the selected device, and initiates communication.
     * If configured, the `onConnect()` callback function will be executed after the connection is established.
     * @async
     * @returns Promise that resolves when the device is fully connected and communication has started, or rejects if an
     *   error occurs.
     */
    /**
      * Открывает окно выбора Bluetooth-устройства в браузере, чтобы выбрать устройство, если оно ранее не было выбрано, устанавливает
      * соединение с выбранным устройством и инициирует связь.
      * Если настроено, функция обратного вызова `onConnect()` будет выполнена после установления соединения.
      * @async
      * @returns Promise, который разрешается, когда устройство полностью подключено и связь началась, или отклоняется, если
      * возникает ошибка.
      */
    async connect() {
      this._logInfo('connect', 'Initiating connection process...');
      if (!this._device) {
        this._logInfo('connect', 'Opening browser Bluetooth device picker...');
        try {
          this._device = await this._requestDevice(this._serviceUuid);
        } catch (error) {
          this._logError('connect', error, errorMessage => `Connection failed: "${errorMessage}"`);
          throw error;
        }
      } else {
        this._logInfo('connect', `Connecting to previously selected device "${this.getDeviceName()}"...`);
      }
  
      // Register event listener to handle disconnection and attempt automatic reconnection.
      this._device.addEventListener('gattserverdisconnected', this._boundGattServerDisconnectedListener);
      try {
        await this._connectDevice();
      } catch (error) {
        this._logError('connect', error, errorMessage => `Connection failed: "${errorMessage}"`);
        throw error;
      }
      this._logInfo('connect', `Device "${this.getDeviceName()}" successfully connected`);
    }
  
    /**
     * Disconnects from the currently connected device and cleans up associated resources.
     * If configured, the `onDisconnect()` callback function will be executed after the complete disconnection.
     */
    /**
      * Отключается от подключенного устройства и очищает связанные ресурсы.
      * Если настроено, функция обратного вызова `onDisconnect()` будет выполнена после полного отключения.
      */
    disconnect() {
      if (!this._device) {
        this._logWarn('disconnect', 'No device is currently connected');
        return;
      }
      this._logInfo('disconnect', `Initiating disconnection from device "${this.getDeviceName()}"...`);
      if (this._characteristic) {
        // Stop receiving and processing incoming messages from the device.
        // Прекратить прием и обработку входящих сообщений с устройства.
        this._characteristic.removeEventListener('characteristicvaluechanged', this._boundCharacteristicValueChangedListener);
        this._characteristic = null;
      }
  
      // Remove reconnection handler to prevent automatic reconnection attempts.
      // Удалите обработчик повторного подключения, чтобы предотвратить автоматические попытки повторного подключения.
      this._device.removeEventListener('gattserverdisconnected', this._boundGattServerDisconnectedListener);
      if (!this._device.gatt) {
        throw new Error('GATT server is not available');
      }
      if (!this._device.gatt.connected) {
        this._logWarn('disconnect', `Device "${this.getDeviceName()}" is already disconnected`);
        return;
      }
      try {
        this._device.gatt.disconnect();
      } catch (error) {
        this._logError('disconnect', error, errorMessage => `Disconnection failed: "${errorMessage}"`);
        throw error;
      }
      this._logInfo('disconnect', `Device "${this.getDeviceName()}" successfully disconnected`);
      this._device = null;
      if (this._onDisconnectCallback) {
        this._logDebug('disconnect', `Executing onDisconnect callback...`);
        this._onDisconnectCallback();
        this._logDebug('disconnect', `onDisconnect callback was executed successfully`);
      }
    }
  
    /**
     * Handler for incoming messages received from the connected device. Override this method to process messages
     * received from the connected device. Each time a complete message (ending with the receive separator) is processed,
     * this method will be called with the message string.
     * @deprecated Use `onReceive()` instead.
     * @param message String message received from the connected device, with separators removed
     */
    /**
      * Обработчик входящих сообщений, полученных от подключенного устройства. Переопределите этот метод для обработки сообщений,
      * полученных от подключенного устройства. 
      * Каждый раз, когда обрабатывается полное сообщение (заканчивающееся разделителем "Получено"),
      * этот метод будет вызываться со строкой сообщения.
      * @deprecated Используйте `onReceive()` вместо этого.
      * @param message Строка сообщения, полученного от подключенного устройства, без разделителей
      */
    receive(message) {// eslint-disable-line @typescript-eslint/no-unused-vars
      // The placeholder method is intended to be overridden by users to handle incoming messages.
      // Метод-заполнитель предназначен для переопределения пользователями для обработки входящих сообщений.
    }
  
    /**
     * Sends a message to the connected device, automatically adding the configured send separator and splitting the
     * message into appropriate chunks if it exceeds the maximum characteristic value size.
     * @async
     * @param message String message to send to the connected device
     * @returns Promise that resolves when message successfully sent, or rejects if the device is disconnected or an
     *   error occurs.
     */
    /**
      * Отправляет сообщение на подключенное устройство, автоматически добавляя настроенный разделитель отправки и разбивая
      * сообщение на соответствующие фрагменты, если оно превышает максимальный размер значения характеристики.
      * @async
      * @param message Строка сообщения для отправки на подключенное устройство
      * @returns Promise, который разрешается при успешной отправке сообщения или отклоняется, если устройство отключено или произошла
      * ошибка.
      */
    async send(message) {
      // Ensure message is a string, defaulting to empty string if undefined/null.
      // Убедитесь, что сообщение является строкой; по умолчанию используется пустая строка, если значение не определено/равно null.
      message = String(message || '');
  
      // Validate that the message is not empty after conversion.
      // Проверяем, не пусто ли сообщение после преобразования.
      if (!message) {
        throw new Error('Message must be a non-empty string');
      }
  
      // Verify the communication channel before attempting to send.
      // Перед попыткой отправки проверьте канал связи.
      if (!this._device || !this._characteristic) {
        throw new Error('Device must be connected to send a message');
      }
      this._logDebug('send', `Sending message: "${message}"...`);
  
      // Append the configured send separator to the message.
      // Добавить заданный разделитель отправки к сообщению.
      message += this._sendSeparator;
  
      // Split the message into chunks according to the characteristic value size limit.
      // Разделить сообщение на фрагменты в соответствии с ограничением размера значения характеристики.
      const chunks = [];
      for (let i = 0; i < message.length; i += this._characteristicValueSize) {
        chunks.push(message.slice(i, i + this._characteristicValueSize));
      }
      this._logDebug('send', `Sending in ${chunks.length} chunk${chunks.length > 1 ? 's' : ''}: "${chunks.join('", "')}"...`);
      try {
        // Send chunks sequentially.
        // Отправка фрагментов осуществляется последовательно.
        for (let i = 0; i < chunks.length; i++) {
          this._logDebug('send', `Sending chunk ${i + 1}/${chunks.length}: "${chunks[i]}"...`);
          await this._characteristic.writeValue(new TextEncoder().encode(chunks[i]));
        }
      } catch (error) {
        this._logError('send', error, errorMessage => `Sending failed: "${errorMessage}"`);
        throw error;
      }
      this._logDebug('send', 'Message successfully sent');
    }
  
    /**
     * Retrieves the name of the currently connected device.
     * @returns Device name or an empty string if no device is connected or has no name.
     */
    /**
      * Получает имя подключенного в данный момент устройства.
      * @returns Имя устройства или пустую строку, если устройство не подключено или не имеет имени.
      */
    getDeviceName() {
      return this._device && this._device.name ? this._device.name : '';
    }
  
    /**
     * Establishes a connection to the current device, starts communication, sets up an event listener to process
     * incoming messages, and invokes the `onConnect()` callback if one has been configured. This method is called
     * internally by the `connect()` method and the reconnection listener.
     * @async
     * @returns Promise that resolves when the device is fully connected and communication has started, or rejects if an
     *   error occurs.
     */
    /**
      * Устанавливает соединение с текущим устройством, начинает обмен данными, настраивает обработчик событий для обработки
      * входящих сообщений и вызывает функцию обратного вызова `onConnect()`, если она настроена. Этот метод вызывается
      * внутренне методом `connect()` и обработчиком повторного подключения.
      * @async
      * @returns Promise, который разрешается, когда устройство полностью подключено и обмен данными начался, или отклоняется, если
      * возникает ошибка.
      */
    async _connectDevice() {
      if (!this._device) {
        throw new Error('Device must be selected to connect');
      }
      this._log('_connectDevice', `Establishing connection to device "${this.getDeviceName()}"...`);
      try {
        this._characteristic = await this._startNotifications(this._device, this._serviceUuid, this._characteristicUuid);
      } catch (error) {
        this._logError('_connectDevice', error, errorMessage => `Connection failed: "${errorMessage}"`);
        throw error;
      }
  
      // Set up an event listener to receive and process incoming messages from the device.
      // Настройте обработчик событий для приема и обработки входящих сообщений с устройства.
      this._characteristic.addEventListener('characteristicvaluechanged', this._boundCharacteristicValueChangedListener);
      if (this._onConnectCallback) {
        this._logDebug('_connectDevice', `Executing onConnect callback...`);
        this._onConnectCallback();
        this._logDebug('_connectDevice', `onConnect callback was executed successfully`);
      }
      this._log('_connectDevice', 'Connection established and communication started');
    }
  
    /**
     * Opens the browser Bluetooth device picker and allows the user to select a device that supports the specified
     * service UUID. This method is stateless and doesn't modify any instance properties.
     * @async
     * @param serviceUuid Service UUID
     * @returns Promise that resolves with the selected Bluetooth device object.
     */
    /**
      * Открывает средство выбора Bluetooth-устройств в браузере и позволяет пользователю выбрать устройство, поддерживающее указанный
      * UUID службы. Этот метод не имеет состояния и не изменяет никаких свойств экземпляра.
      * @async
      * @param serviceUuid UUID службы
      * @returns Promise, который разрешается с выбранным объектом Bluetooth-устройства.
      */
    async _requestDevice(serviceUuid) {
      this._logDebug('_requestDevice', `Opening browser Bluetooth device picker for service UUID "${serviceUuid}"...`);
      let device;
      try {
        device = await navigator.bluetooth.requestDevice({
          filters: [{
            services: [serviceUuid]
          }]
        });
      } catch (error) {
        this._logError('_requestDevice', error, errorMessage => `Requesting device failed: "${errorMessage}"`);
        throw error;
      }
      this._logDebug('_requestDevice', `Device "${device.name}" selected`);
      return device;
    }
  
    /**
     * Establishes a connection to the provided device GATT server, retrieves the specified service, accesses the
     * specified characteristic, and starts notifications on that characteristic. This method is stateless and doesn't
     * modify any instance properties.
     * @async
     * @param device Bluetooth device object
     * @param serviceUuid Service UUID
     * @param characteristicUuid Characteristic UUID
     * @returns Promise that resolves with the Bluetooth characteristic object with notifications enabled.
     */
    /**
      * Устанавливает соединение с предоставленным GATT-сервером устройства, получает указанную службу, обращается к
      * указанной характеристике и запускает уведомления для этой характеристики. Этот метод не имеет состояния и не
      * изменяет какие-либо свойства экземпляра.
      * @async
      * @param device Объект Bluetooth-устройства
      * @param serviceUuid UUID службы
      * @param characteristicUuid UUID характеристики
      * @returns Promise, который разрешается с объектом характеристики Bluetooth с включенными уведомлениями.
      */
    async _startNotifications(device, serviceUuid, characteristicUuid) {
      if (!device.gatt) {
        throw new Error('GATT server is not available');
      }
      this._log('_startNotifications', 'Connecting to GATT server...');
      const server = await device.gatt.connect();
      this._log('_startNotifications', 'GATT server connected successfully');
      this._log('_startNotifications', `Looking for service with UUID "${serviceUuid}"...`);
      const service = await server.getPrimaryService(serviceUuid);
      this._log('_startNotifications', `Service with UUID "${serviceUuid}" found successfully`);
      this._log('_startNotifications', `Looking for characteristic with UUID "${characteristicUuid}"...`);
      const characteristic = await service.getCharacteristic(characteristicUuid);
      this._log('_startNotifications', `Characteristic with UUID "${characteristicUuid}" found successfully`);
      this._log('_startNotifications', 'Starting notifications on characteristic...');
      await characteristic.startNotifications();
      this._log('_startNotifications', 'Notifications on characteristic started successfully');
      return characteristic;
    }
  
    /**
     * Handles the `characteristicvaluechanged` event from the Bluetooth characteristic. Decodes incoming value,
     * accumulates characters until the receive separator is encountered, then processes the complete message and invokes
     * appropriate callback.
     * @param event Event
     */
    /**
    * Обрабатывает событие `characteristicvaluechanged` от характеристики Bluetooth. Декодирует входящее значение,
    * накапливает символы до тех пор, пока не встретит разделитель приема, затем обрабатывает все сообщение и вызывает
    * соответствующую функцию обратного вызова.
    * @param event Событие
    */
    _characteristicValueChangedListener(event) {
      // `event.target` will be `BluetoothRemoteGATTCharacteristic` when event triggered with this listener.
      // При срабатывании события с помощью этого слушателя `event.target` будет иметь значение `BluetoothRemoteGATTCharacteristic`.
      const value = new TextDecoder().decode(event.target.value);
      this._logDebug('_characteristicValueChangedListener', `Value received: "${value}"`);
      for (const c of value) {
        if (c === this._receiveSeparator) {
          const message = this._receiveBuffer.trim();
          this._receiveBuffer = '';
          if (message) {
            this._logDebug('_characteristicValueChangedListener', `Message received: "${message}"`);
            // @deprecated
            this.receive(message);
            if (this._onReceiveCallback) {
              this._logDebug('_characteristicValueChangedListener', `Executing onReceive callback with message "${message}"...`);
              this._onReceiveCallback(message);
              this._logDebug('_characteristicValueChangedListener', 'onReceive callback was executed successfully');
            }
          }
        } else {
          this._receiveBuffer += c;
        }
      }
    }
  
    /**
     * Handles the 'gattserverdisconnected' event from the Bluetooth device. This event is triggered when the connection
     * to the GATT server is lost. The method invokes the `onDisconnect()` callback if one has been configured and
     * attempts to reconnect to the device automatically.
     * @param event Event
     */
    /**
      * Обрабатывает событие 'gattserverdisconnected' от устройства Bluetooth. Это событие срабатывает при потере соединения
      * с сервером GATT. Метод вызывает функцию обратного вызова `onDisconnect()`, если она настроена, и
      * пытается автоматически переподключиться к устройству.
      * @param event Событие
      */
    _gattServerDisconnectedListener(event) {
      // `event.target` will be `BluetoothDevice` when event triggered with this listener.
      // При срабатывании события с помощью этого слушателя `event.target` будет иметь значение `BluetoothDevice`.
      const device = event.target;
      this._log('_gattServerDisconnectedListener', `Device "${device.name}" was disconnected...`);
      if (this._onDisconnectCallback) {
        this._logDebug('_gattServerDisconnectedListener', `Executing onDisconnect callback...`);
        this._onDisconnectCallback();
        this._logDebug('_gattServerDisconnectedListener', `onDisconnect callback was executed successfully`);
      }
  
      // `this._device` is not reassigned to `device` (`event.target`) here because `this._device` _should_ already be
      // set during the previous connection process and _should_ remain valid for reconnection.
      // Здесь `this._device` не переназначается `device` (`event.target`), потому что `this._device` _должен_ быть уже установлен 
      //во время предыдущего процесса подключения и _должен_ оставаться действительным для повторного подключения.
      this._log('_gattServerDisconnectedListener', `Attempting to reconnect to device "${this.getDeviceName()}"...`);
  
      // Using IIFE to leverage async/await while maintaining the void return type required by the event handler
      // interface. Try/catch is required here to avoid propagating the error as there is no place to catch it.
      // Использование IIFE для применения async/await при сохранении типа возвращаемого значения void, необходимого для обработчика событий.
      // Интерфейс. Здесь необходим try/catch, чтобы избежать распространения ошибки, поскольку нет места для ее перехвата.
      (async () => {
        try {
          await this._connectDevice();
          this._log('_gattServerDisconnectedListener', `Device "${this.getDeviceName()}" successfully reconnected`);
        } catch (error) {
          this._logError('_gattServerDisconnectedListener', error, errorMessage => `Reconnection failed: "${errorMessage}"`);
        }
      })();
    }
    
    _logGeneric(logLevel, method, message, error) {
      if (this._onLogCallback) {
        this._onLogCallback(logLevel, method, message, error);
      }
      if (BluetoothTerminal._logLevels.indexOf(this._logLevel) < BluetoothTerminal._logLevels.indexOf(logLevel)) {
        return;
      }
      const logMessage = `[BluetoothTerminal][${method}] ${message}`;
      switch (logLevel) {
        case 'debug':
          console.debug(logMessage);
          break;
        case 'log':
          console.log(logMessage);
          break;
        case 'info':
          console.info(logMessage);
          break;
        case 'warn':
          console.warn(logMessage);
          break;
        case 'error':
          console.error(logMessage);
          break;
        default:
          throw new Error(`Log level must be one of: "${BluetoothTerminal._logLevels.join('", "')}"`);
      }
    }
    _logDebug(method, message) {
      this._logGeneric('debug', method, message);
    }
    _log(method, message) {
      this._logGeneric('log', method, message);
    }
    _logInfo(method, message) {
      this._logGeneric('info', method, message);
    }
    _logWarn(method, message) {
      this._logGeneric('warn', method, message);
    }
    _logError(method, error, messageConstructor) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const message = messageConstructor(errorMessage);
      this._logGeneric('error', method, message, error);
    }
  }
  
  // Conditionally export the class as CommonJS module for browser vs Node.js compatibility.
  // From least to most verbose, index matters!
  // Условно экспортируем класс как модуль CommonJS для обеспечения совместимости с браузерами и Node.js.
  // Индекс имеет значение, от наименее до наиболее подробного!
  BluetoothTerminal._logLevels = ['none', 'error', 'warn', 'info', 'log', 'debug'];
  
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BluetoothTerminal;
  }