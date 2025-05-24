# ---- Build Stage ----
FROM amazoncorretto:21 AS builder
WORKDIR /app

# Copy Maven wrapper and pom files for dependency caching
COPY gateway-server/.mvn/ /app/gateway-server/.mvn/
COPY gateway-server/mvnw  /app/gateway-server/
COPY gateway-server/pom.xml /app/gateway-server/

RUN yum install -y tar gzip

# Set working directory to booking-service for Maven commands
WORKDIR /app/gateway-server

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code (adjust paths relative to /app)
COPY gateway-server/src/ ./src/

# Build application JAR
RUN ./mvnw package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:21
WORKDIR /app

# Copy built JAR from build stage
COPY --from=builder /app/gateway-server/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]