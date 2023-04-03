FROM gradle:7.6.1-jdk17 AS builder

WORKDIR /usr/src/app

COPY . .
RUN gradle bootJar

FROM eclipse-temurin:17-jre

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ .

CMD ["java", "-jar", "./build/libs/dice-0.0.1-SNAPSHOT.jar"]
