/* eslint-disable no-undef */

const jwt = require('jsonwebtoken');
const config = require('../../server/auth/config');
const { tokenParsing, exclude } = require('../../server/auth/checkToken');

test('excludeUrls', () => {
    expect(exclude('/')).toBe(true);
    expect(exclude('/my')).toBe(false);
    expect(exclude('')).toBe(false);
});

test('invalidTokenParsing', () => {
    expect(tokenParsing('123').error).toBe(true);
});

test('validTokenParsing', () => {
    const token = jwt.sign({ username: 'test' }, config.secret, { expiresIn: '24h' });
    expect(tokenParsing(token).error).toBe(false);
    expect(tokenParsing(token).decodedInfo.username).toBe('test');
});
