# ---- Build Stage ----
FROM amazoncorretto:21 AS builder
WORKDIR /app

# Copy Maven wrapper and pom files for dependency caching
COPY payment-service/.mvn/ /app/payment-service/.mvn/
COPY payment-service/mvnw  /app/payment-service/
COPY payment-service/pom.xml /app/payment-service/
COPY shared-module/.mvn/ /app/shared-module/.mvn/
COPY shared-module/mvnw /app/shared-module/
COPY shared-module/pom.xml /app/shared-module/

RUN yum install -y tar gzip

# Set working directory to booking-service for Maven commands
WORKDIR /app/shared-module

# Download dependencies
RUN ./mvnw dependency:go-offline -B

COPY shared-module/src/ ./src/

RUN ./mvnw install -DskipTests



# Set working directory to booking-service for Maven commands
WORKDIR /app/payment-service

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code (adjust paths relative to /app)
COPY payment-service/src/ ./src/

# Build application JAR
RUN ./mvnw package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:21
WORKDIR /app

# Copy built JAR from build stage
COPY --from=builder /app/payment-service/target/*.jar app.jar

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "/app/app.jar"]