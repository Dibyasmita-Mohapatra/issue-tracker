FROM maven:3.9.6-eclipse-temurin-22 AS build

WORKDIR /Backend

COPY Backend/pom.xml .
COPY Backend/src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:22-jdk

WORKDIR /app

COPY --from=build /Backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
