const UUID = require('../src/uuid');

(async () => {
    console.log(UUID.v1()); // Version 1 UUID
    console.log(await UUID.v3('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 3 UUID
    console.log(UUID.v4()); // Version 4 UUID
    console.log(await UUID.v5('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 5 UUID
    console.log(UUID.v6()); // Version 6 UUID
    console.log(UUID.v7()); // Version 7 UUID
})();