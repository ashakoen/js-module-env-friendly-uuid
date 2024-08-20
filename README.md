# Environmentally Friendly UUID Module

An efficient, RFC-compliant UUID generator for both Node.js and browser environments. This module provides a minimal and lightweight solution for generating UUIDs, designed to be environmentally friendly by reducing code footprint and resource usage.

## Features

- Supports UUID versions 1, 3, 4, 5, 6, and 7
- Compatible with both Node.js and browser environments
- Minimal code footprint (less than 200 lines of code)
- No external dependencies (except for MD5 hashing in browsers)
- Fully RFC-compliant
- Environmentally friendly due to reduced data transfer and storage requirements

## Installation

### Node.js

1. Clone this repository or download the `uuid.js` file.
2. Place the `uuid.js` file in your project directory.

### Browser

1. Download the `uuid.js` file.
2. Include the script in your HTML file:

```html
<script src="path/to/uuid.js"></script>
```

For MD5 hashing support in browsers (required for v3 UUIDs), also include:

```html
<script src="path/to/spark-md5.min.js"></script>
```

Note: You'll need to provide your own `spark-md5.min.js` file for browser environments.

## Usage

### Node.js

```javascript
const UUID = require('./uuid.js');

(async () => {
    console.log(UUID.v1()); // Version 1 UUID
    console.log(await UUID.v3('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 3 UUID
    console.log(UUID.v4()); // Version 4 UUID
    console.log(await UUID.v5('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 5 UUID
    console.log(UUID.v6()); // Version 6 UUID
    console.log(UUID.v7()); // Version 7 UUID
})();
```

### Browser

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>UUID Generator</title>
    <script src="path/to/spark-md5.min.js"></script>
    <script src="path/to/uuid.js"></script>
</head>
<body>
    <script>
        document.addEventListener("DOMContentLoaded", async () => {
            console.log(UUID.v1()); // Version 1 UUID
            console.log(await UUID.v3('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 3 UUID
            console.log(UUID.v4()); // Version 4 UUID
            console.log(await UUID.v5('example.com', '6ba7b810-9dad-11d1-80b4-00c04fd430c8')); // Version 5 UUID
            console.log(UUID.v6()); // Version 6 UUID
            console.log(UUID.v7()); // Version 7 UUID
        });
    </script>
</body>
</html>
```

## API

- `UUID.v1()`: Generate a version 1 UUID (time-based)
- `UUID.v3(name, namespace)`: Generate a version 3 UUID (name-based, MD5 hash)
- `UUID.v4()`: Generate a version 4 UUID (random)
- `UUID.v5(name, namespace)`: Generate a version 5 UUID (name-based, SHA-1 hash)
- `UUID.v6()`: Generate a version 6 UUID (time-based with reordered bits)
- `UUID.v7()`: Generate a version 7 UUID (time-based with Unix Epoch timestamp)

## The Story Behind Environmentally Friendly UUID Module

This module was created in response to discovering a GitHub repository with a UUID creation Javascript module that was thousands of lines of code. Believing that a better and much simpler solution was possible, this environmentally friendly UUID module was developed. The goal was to create an efficient, minimal implementation that still provides full RFC-compliant UUID functionality.

## File Structure

- `src/uuid.js`: The main JavaScript file containing the UUID generation logic.
- `examples/gen_uuid.html`: An example HTML file demonstrating browser usage.
- `examples/gen_uuid.js`: An example Node.js script demonstrating server-side usage.
- `README.md`: This file, providing information about the project.

## Dependencies

This module has no external dependencies for Node.js environments. For browser environments, the only external dependency is `spark-md5` for MD5 hashing (required for v3 UUIDs).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For any questions or suggestions, please open an issue on the GitHub repository.