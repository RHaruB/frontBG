export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/login'
    },

    USUARIOS: {
        BASE: '/usuario',
        BY_ID: (id: number) => `/usuario/${id}`
    },

    CLIENTES: {
        BASE: '/cliente',
        BY_ID: (id: number) => `/cliente/${id}`
    },

    PRODUCTOS: {
        BASE: '/producto',
        BY_ID: (id: number) => `/producto/${id}`
    },

    FACTURAS: {
        BASE: '/factura',
        BY_ID: (id: number) => `/factura/${id}`
    },

    FORMAS_PAGO: {
        BASE: '/formapago'
    }
} as const;

export const APP_CONSTANTS = {
    STORAGE_KEYS: {
        TOKEN: 'auth_token',
        REFRESH_TOKEN: 'refresh_token',
        USER: 'user_data',
        THEME: 'app_theme'
    },

    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
    },

    DATE_FORMAT: 'dd/MM/yyyy',
    DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
    CURRENCY: 'USD',

    VALIDATION: {
        MIN_PASSWORD_LENGTH: 6,
        MAX_PASSWORD_LENGTH: 50,
        MIN_USERNAME_LENGTH: 3,
        MAX_USERNAME_LENGTH: 50
    }
} as const;

export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Registro creado exitosamente',
        UPDATED: 'Registro actualizado exitosamente',
        DELETED: 'Registro eliminado exitosamente',
        LOGIN: 'Inicio de sesión exitoso',
        LOGOUT: 'Sesión cerrada exitosamente'
    },

    ERROR: {
        GENERIC: 'Ha ocurrido un error. Por favor, intente nuevamente',
        NETWORK: 'Error de conexión. Verifique su conexión a internet',
        UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
        NOT_FOUND: 'Registro no encontrado',
        VALIDATION: 'Por favor, verifique los datos ingresados'
    },

    CONFIRM: {
        DELETE: '¿Está seguro que desea eliminar este registro?',
        CANCEL: '¿Está seguro que desea cancelar? Los cambios no guardados se perderán',
        LOGOUT: '¿Está seguro que desea cerrar sesión?'
    }
} as const;
