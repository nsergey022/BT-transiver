// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('sw.js');
// }

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js') // Путь к вашему файлу сервис-воркера к файлу sw.js
    .then(() => console.log('Service Worker зарегистрирован!'))
    .catch(err => console.log('Ошибка регистрации SW:', err));
}