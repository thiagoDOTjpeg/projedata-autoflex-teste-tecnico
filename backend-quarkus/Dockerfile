FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/quarkus-app/ .

EXPOSE 8081

ENV QUARKUS_HTTP_HOST=0.0.0.0

CMD ["java", "-jar", "quarkus-run.jar"]