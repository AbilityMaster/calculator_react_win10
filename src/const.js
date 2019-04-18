export const MAX_WIDTH_DISPLAY = 286;
export const MAX_LENGTH_DISPLAY = 10;

export const CALC_MODES = {
	STANDART: 'standart',
	MINIMIZED: 'minimized',
	CLOSED: 'closed',
	DEFAULT: 'default'
};

export const MESSAGES = {
	OVERFLOW: 'Переполнение',
	DIVIDE_BY_ZERO: 'Деление на 0 невозможно',
	UNCORRECT_DATA: 'Введены неверные данные',
	ERROR: {
		MODES: 'Ошибка в режиме калькулятора',
		OPERATIONS: 'Ошибка в работе операций',
		EVENTS: 'Ошибка в назначении событий',
		EXCEPTIONS: 'Ошибка в обработке исключений',
		SMALL_DISPLAY: 'Ошибка в работе дисплея с историей'
	}
};

export const STYLES = {
	SMALL: '20px',
	NORMAL: '45px'
};

export const OPERATIONS = {
	PLUS: '+',
	MINUS: '-',
	MULTIPLY: '*',
	DIVIDE: '÷',
	POW: 'POW',
	FRAC: 'FRAC',
	SQRT: 'SQRT',
	NEGATE: 'NEGATE',
	PERCENT: 'PERCENT',
	LABEL_SINGLE_OPERATION: 'single',
	LABEL_DEFAULT_OPERATION: 'default',
	NAME_OF_DATASET_ATTRIBUTE: {
		VALUE: 'value',
		OPERATION: 'operation',
		ADDITIONAL: 'add'
	},
	ADDITIONAL: {
		PLUS_MINUS: '±',
		PERCENT: '%',
		SQRT: '√',
		POW: 'POW',
		FRAC: 'frac',
		CLEAR: 'clear',
		BACKSPACE: 'back',
		REVERSE: 'reverse',
		POINT: 'point',
		RESULT: 'result',
		MCLEAR: 'maclear',
		MREAD: 'mread',
		MPLUS: 'mplus',
		MMINUS: 'mminus',
		MSAVE: 'msave',
		MEMORY: 'memory'
	}
};


export const NAME_FOR_DISPLAY = {
	[OPERATIONS.POW]: 'sqr',
	[OPERATIONS.FRAC]: '1/',
	[OPERATIONS.SQRT]: '√',
	[OPERATIONS.NEGATE]: 'negate'
};