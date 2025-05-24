# ---- Build Stage ----
FROM amazoncorretto:21 AS builder
WORKDIR /app

# Copy Maven wrapper and pom files for dependency caching
COPY notification-service/.mvn/ /app/notification-service/.mvn/
COPY notification-service/mvnw  /app/notification-service/
COPY notification-service/pom.xml /app/notification-service/
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
WORKDIR /app/notification-service

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code (adjust paths relative to /app)
COPY notification-service/src/ ./src/

# Build application JAR
RUN ./mvnw package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:21
WORKDIR /app

# Copy built JAR from build stage
COPY --from=builder /app/notification-service/target/*.jar app.jar

EXPOSE 8088

ENTRYPOINT ["java", "-jar", "/app/app.jar"]