#!/bin/bash

if [[ "${OTEL_INSTRUMENTATION_ENABLED}" == "true" ]] ; then
    echo 'Run with instrumentation'
    node -r ./instrument.js index.js
else 
    node index.js
fi