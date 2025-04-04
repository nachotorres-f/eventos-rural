type Chars = {
    [key: string]: string;
};

export const sanitizeString = (str: string) => {
    if (!str) return '';

    str = str.toString().trim();

    const mapping: Chars = {
        á: '\\a',
        é: '\\e',
        í: '\\i',
        ó: '\\o',
        ú: '\\u',
        Á: '\\A',
        É: '\\E',
        Í: '\\I',
        Ó: '\\O',
        Ú: '\\U',
        ü: '\\u2',
        Ü: '\\U2',
        ñ: '\\n',
        Ñ: '\\N',
        '°': '\\d', // Grado
        '´': "\\'",
        Â: '\\A2',
        â: '\\a2',
        Ã: '\\A3',
        ã: '\\a3',
        '³': '\\3',
        '¬': '\\xad',
        '­': '\\xad',
        '±': '\\xb1',
        '¡': '\\xa1',
        '': '\\u0081',
        '©': '\\u00A9',
        '¸': '\\b8',
        '': '\\u2019',
        //'´': '\\´',
        '‘': '\\x91',
        '': '\\x91',
        '\\x91': '\\x91',
        º: '\\xba', // Grado
        '¿': '\\xbf',
        '¯': '\\xaf',
        '½': '\\xbd', // Agregado para ½ (un medio)
    };
    return str
        .replace(
            /[áéíóúüñ°ÁÉÍÓÚÜÑ´ÂâÃã³¬­±¡©¸´‘\\x91º¿¯½]/g,
            (match) => mapping[match]
        )
        .trim();
};
