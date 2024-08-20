(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.UUID = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // Utility function to get random values
    function getRandomValues(buffer) {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            return crypto.getRandomValues(buffer); // Browser
        } else if (typeof require !== 'undefined') {
            return require('crypto').randomFillSync(buffer); // Node.js
        } else {
            throw new Error('Crypto API not available. Ensure you are running in a supported environment.');
        }
    }

    function bytesToHex(bytes) {
        return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    // Fallback MD5 hash function using spark-md5 for browsers
    function md5Fallback(bytes) {
        if (typeof SparkMD5 !== 'undefined') {
            const hash = SparkMD5.ArrayBuffer.hash(new Uint8Array(bytes));
            return Array.from(new Uint8Array(hash.match(/.{2}/g).map(byte => parseInt(byte, 16))));
        } else {
            throw new Error('MD5 not supported in this environment');
        }
    }

    async function hashBytes(bytes, algorithm) {
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            try {
                const buffer = await crypto.subtle.digest(algorithm, new Uint8Array(bytes));
                return Array.from(new Uint8Array(buffer));
            } catch (e) {
                if (algorithm === 'MD5') {
                    return md5Fallback(bytes); // Use fallback for MD5 in browsers
                }
                throw e;
            }
        } else if (typeof require !== 'undefined') {
            const crypto = require('crypto');
            const hash = crypto.createHash(algorithm.toLowerCase().replace('-', ''));
            hash.update(Buffer.from(bytes));
            return Array.from(hash.digest());
        } else {
            throw new Error('Crypto API not available. Ensure you are running in a supported environment.');
        }
    }

    function timeBasedUUID(version, nodeId, clockSeq) {
        const buffer = new Uint8Array(16);
        const time = Date.now();
        const timeHi = (time / 0x100000000) & 0xfffffff;
        const timeLo = time & 0xffffffff;
        const timeMid = (timeHi >> 4) & 0xffff;

        buffer[0] = timeLo >>> 24 & 0xff;
        buffer[1] = timeLo >>> 16 & 0xff;
        buffer[2] = timeLo >>> 8 & 0xff;
        buffer[3] = timeLo & 0xff;

        buffer[4] = timeMid >>> 8 & 0xff;
        buffer[5] = timeMid & 0xff;

        buffer[6] = (timeHi & 0xfff) | (version << 4);
        buffer[7] = (timeHi >>> 8 & 0x3f) | 0x80;

        if (!clockSeq) {
            clockSeq = (Math.random() * 0x3fff) | 0;
        }
        buffer[8] = (clockSeq >>> 8) | 0x80;
        buffer[9] = clockSeq & 0xff;

        if (!nodeId) {
            nodeId = getRandomValues(new Uint8Array(6));
            nodeId[0] |= 0x01;
        }

        buffer.set(nodeId, 10);
        return buffer; // Return buffer instead of hex string
    }

    function generateUUIDv1(nodeId, clockSeq) {
        return bytesToHex(timeBasedUUID(1, nodeId, clockSeq));
    }

    async function generateUUIDv3(name, namespace) {
        const bytes = Array.from(new TextEncoder().encode(namespace + name));
        const uuidBytes = await hashBytes(bytes, 'MD5');
        uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x30;
        uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80;
        return bytesToHex(uuidBytes);
    }

    function generateUUIDv4() {
        const buffer = new Uint8Array(16);
        getRandomValues(buffer);
        buffer[6] = (buffer[6] & 0x0f) | 0x40;
        buffer[8] = (buffer[8] & 0x3f) | 0x80;
        return bytesToHex(buffer);
    }

    async function generateUUIDv5(name, namespace) {
        const bytes = Array.from(new TextEncoder().encode(namespace + name));
        const uuidBytes = await hashBytes(bytes, 'SHA-1');
        uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x50;
        uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80;
        return bytesToHex(uuidBytes);
    }

    function generateUUIDv6(nodeId, clockSeq) {
        const buffer = timeBasedUUID(6, nodeId, clockSeq);
        return [
            bytesToHex(buffer.slice(6, 8)),
            bytesToHex(buffer.slice(4, 6)),
            bytesToHex(buffer.slice(0, 4)),
            bytesToHex(buffer.slice(8, 10)),
            bytesToHex(buffer.slice(10, 16))
        ].join('-');
    }

    let uuidV7Counter = 0;

    function generateUUIDv7() {
        const now = Date.now();
        const time = Math.floor(now / 1000);
        const ms = now % 1000;

        uuidV7Counter = (uuidV7Counter + 1) & 0xFFF;

        const buffer = new Uint8Array(16);
        buffer[0] = (time >>> 26) & 0xff;
        buffer[1] = (time >>> 18) & 0xff;
        buffer[2] = (time >>> 10) & 0xff;
        buffer[3] = (time >>> 2) & 0xff;
        buffer[4] = ((time & 0x03) << 6) | (ms >>> 4);
        buffer[5] = ((ms & 0x0F) << 4) | ((uuidV7Counter >>> 8) & 0x0F);
        buffer[5] = (buffer[5] & 0x0F) | 0x70;

        const rand = getRandomValues(new Uint8Array(8));
        rand[0] = (rand[0] & 0x3F) | 0x80;
        buffer.set(rand, 6);

        return bytesToHex(buffer);
    }

    // Expose API
    return {
        v1: generateUUIDv1,
        v3: generateUUIDv3,
        v4: generateUUIDv4,
        v5: generateUUIDv5,
        v6: generateUUIDv6,
        v7: generateUUIDv7,
    };
}));