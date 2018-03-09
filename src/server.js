'use strict';

let port = process.env.PORT || 8080;

require('./app').listen(port, () => {
    console.log(`Server started on port ${port}`);
});
