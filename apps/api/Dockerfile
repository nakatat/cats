FROM maven:3.9.11-eclipse-temurin-21@sha256:6fdc855a6ed81d288ca7ca37ac6ff5e9308b612485c0801d70b25a858c83d237 AS maven

FROM eclipse-temurin:21.0.13_9-jdk-noble@sha256:06c1f157dacf6b68198bd9a4186dd4c34ef24e65d7bbbe2a0cf8e62571ad38c9 AS base

# Maven同梱の古いJDKを使わず、ツール本体だけを修正版Temurin上で利用する。
COPY --from=maven /usr/share/maven /usr/share/maven
ENV MAVEN_HOME=/usr/share/maven
ENV PATH="${MAVEN_HOME}/bin:${PATH}"

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

FROM eclipse-temurin:21.0.13_9-jre-noble@sha256:0d57a8e90c2bb844c5a8e1b2b71e11eff06dad7edcfd803cd21ed4ae203b2515

WORKDIR /app

ENV SERVER_PORT=8081

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /workspace/target/cats-api-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

HEALTHCHECK --interval=5s --timeout=3s --retries=20 CMD curl --fail http://localhost:${PORT:-${SERVER_PORT:-8081}}/api/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
