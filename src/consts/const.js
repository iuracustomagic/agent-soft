export const consts = {
    WELCOME: 'U r welcome',
    NOT_WELCOME: 'U R NOT WELOCME',
    AUTH: 'Авторизация',
    LOGIN: 'логин',
    PASSWORD: 'пароль',
    RETURN: 'возврат',
    REQUEST: 'заявка',
    PKO: 'ПКО',
    CLIENT: 'Клиент',
    SUM: 'Сумма',
    REQUESTS: 'Заявки',
    SEARCH: 'Поиск',
    RETURNS: 'Возвраты',
    PRODUCT: 'Товар',
    OK: 'ОК',
    INVOICE_WITH_RECEIPT: 'Счет с чеком',
    PROMOTION: 'Акция',
    PRINT_CERTIFICATE: 'Печать сертификата',
    TYPE_OF_DOCUMENT: 'Тип документа',
    UNLOAD: 'Выгружать',
    OPTIONS: 'Настройки',
    LOGOUT: 'Выход',
    ADD_PRODUCT: 'Добавить товар',
    CANCEL: 'Отмена',
    ADD: 'Добавить',
    SEND: 'Отправить',
    BACK: 'Назад',
    CLOSE: 'Закрыть',
    DATE: 'Дата'
}

export const url = {
    DEV: 'https://manager1c.garm.run',
    PROD: 'https://agent.agg.md'
}

export const currentUrl = url.PROD;   //change version here !!!!!!!!!!!!!!!!!!!!!!!

export const ver = currentUrl == url.DEV ? 'dev' : 'prod';