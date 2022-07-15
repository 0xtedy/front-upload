import { Buffer } from 'buffer';

window.global = window;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '1',
    nextTick: require('next-tick')
};