FROM gradle:7.6.1-jdk17 AS builder

WORKDIR /usr/src/app

COPY . .
RUN gradle bootJar

FROM eclipse-temurin:17-jre

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ .

ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar javaagent.jar

COPY run.sh .

CMD ["./run.sh"]

# For debug purpose:
# Comment the CMD above and uncomment the lines below to add the OTel java agent 
# 
# ENV OTEL_TRACES_EXPORTER=logging 
# ENV OTEL_METRICS_EXPORTER=logging 
# ENV OTEL_LOGS_EXPORTER=logging
# CMD ["java", "-javaagent:/javaagent.jar", "-jar", "./build/libs/dice-0.0.1-SNAPSHOT.jar"]
