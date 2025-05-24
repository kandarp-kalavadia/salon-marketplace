# ---- Build Stage ----
FROM amazoncorretto:21 AS builder
WORKDIR /app

# Copy Maven wrapper and pom files for dependency caching
COPY category-service/.mvn/ /app/category-service/.mvn/
COPY category-service/mvnw  /app/category-service/
COPY category-service/pom.xml /app/category-service/
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
WORKDIR /app/category-service

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code (adjust paths relative to /app)
COPY category-service/src/ ./src/

# Build application JAR
RUN ./mvnw package -DskipTests

# ---- Runtime Stage ----
FROM amazoncorretto:21
WORKDIR /app

# Copy built JAR from build stage
COPY --from=builder /app/category-service/target/*.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "/app/app.jar"]