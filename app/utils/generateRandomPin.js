'use strict';

export default function generateRandomPin(pinLength = 5) {
    const output = [];

    for (let i = 0; i < pinLength; i++) {
        output.push(Math.floor(Math.random() * 10));
    }

    return output.join('');
}

