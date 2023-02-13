const RegExpUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/;

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://photograms.nomoredomainsclub.ru',
  'http://photograms.nomoredomainsclub.ru',
];

// Коды ошибок
const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

// Сообщения ошибок
const OK_CARD_DELETE = 'Карточка удалена';
const SUCCESSFUL_COOKIE = 'Кука успешно добавилась к вам =)';
const NOT_FOUND_PAGE = 'Страница по указанному маршруту не найдена';
const NOT_FOUND_CARD_MESSAGE = 'Карточка с указанным _id не найдена.';
const NOT_FOUND_CARDID = 'Передан несуществующий _id карточки.';
const NOT_FOUND_USERID = 'Пользователь по указанному _id не найден.';
const NOT_FOUND_USER = 'Неправильные почта или пароль';
const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные при создании карточки.';
const BAD_REQUEST_CARD_DELETE = 'Переданы некорректные данные при удаление карточки.';
const BAD_REQUEST_CARD_GET = 'Переданы некорректные данные для получения карточек.';
const BAD_REQUEST_PUT_LIKE = 'Переданы некорректные данные для постановки лайка.';
const BAD_REQUEST_DEL_LIKE = 'Переданы некорректные данные для удаления лайка.';
const BAD_REQUEST_CREATE_USER = 'Переданы некорректные данные при создании пользователя.';
const BAD_REQUEST_UPDATE_AVATAR = 'Переданы некорректные данные при обновлении аватара.';
const BAD_REQUEST_SEARCH_USER = 'Переданы некорректные данные при поиске пользователя.';
const UNAUTHORIZED_CARD = 'Данная карточка пренодлежит другому пользователю';
const CONFLICT_EMAIL = 'Пользователь с такой почтой уже существует';
const INTERNAL_SERVER_ERROR_MESSAGE = 'Произошла неизвестная ошибка, проверьте корректность запроса';

module.exports = {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  OK_CARD_DELETE,
  SUCCESSFUL_COOKIE,
  NOT_FOUND_PAGE,
  NOT_FOUND_CARD_MESSAGE,
  NOT_FOUND_CARDID,
  NOT_FOUND_USERID,
  NOT_FOUND_USER,
  BAD_REQUEST_MESSAGE,
  BAD_REQUEST_CARD_DELETE,
  BAD_REQUEST_CARD_GET,
  BAD_REQUEST_PUT_LIKE,
  BAD_REQUEST_DEL_LIKE,
  BAD_REQUEST_CREATE_USER,
  BAD_REQUEST_UPDATE_AVATAR,
  BAD_REQUEST_SEARCH_USER,
  UNAUTHORIZED_CARD,
  CONFLICT_EMAIL,
  INTERNAL_SERVER_ERROR_MESSAGE,
  allowedCors,
  RegExpUrl,
};
