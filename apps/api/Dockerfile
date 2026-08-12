FROM maven:3.9.11-eclipse-temurin-21 AS base

WORKDIR /workspace

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS dev

ENV SERVER_PORT=8081
ENV MAVEN_OPTS=-Dmaven.repo.local=/root/.m2

EXPOSE 8081

HEALTHCHECK --interval=5s --timeout=3s --retries=20 CMD curl --fail http://localhost:${PORT:-${SERVER_PORT:-8081}}/api/health || exit 1

CMD ["mvn", "-q", "-DskipTests", "spring-boot:run"]

FROM base AS build

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

ENV SERVER_PORT=8081

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /workspace/target/cats-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

HEALTHCHECK --interval=5s --timeout=3s --retries=20 CMD curl --fail http://localhost:${PORT:-${SERVER_PORT:-8081}}/api/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
