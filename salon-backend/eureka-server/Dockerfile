# ---- Build Stage ----
FROM amazoncorretto:21 AS builder
WORKDIR /app

# Copy Maven wrapper and pom files for dependency caching
COPY eureka-server/.mvn/ /app/eureka-server/.mvn/
COPY eureka-server/mvnw  /app/eureka-server/
COPY eureka-server/pom.xml /app/eureka-server/

RUN yum install -y tar gzip

# Set working directory to booking-service for Maven commands
WORKDIR /app/eureka-server

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code (adjust paths relative to /app)
COPY eureka-server/src/ ./src/

# Build application JAR
RUN ./mvnw package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:21
WORKDIR /app

# Copy built JAR from build stage
COPY --from=builder /app/eureka-server/target/*.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "/app/app.jar"]