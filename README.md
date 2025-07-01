# Salon Marketplace

## Overview

Salon Marketplace is a learning project designed to explore **microservice architecture** using Spring Boot. The application serves as a platform connecting salon owners and customers, focusing on implementing microservices concepts with minimal features and validations.

## Features

### Salon Owner
- **Salon Registration**: Register a salon on the platform.
- **Manage Service Categories and Services**: Add, update, or remove service categories and individual services offered by the salon.
- **View Reviews and Ratings**: Access customer feedback and ratings for the salon.
- **Customer Bookings**: View and manage bookings made by customers.
- **Notifications**: Receive notifications for confirmed bookings.

### Customer
- **Customer Registration**: Sign up as a customer on the platform.
- **Search Salons**: Search for salons by name, service, or city.
- **Book Services**: Book available services from salons.
- **Payment**: Process payments securely via Stripe integration.
- **Notifications**: Receive notifications for confirmed bookings.

## Notes
- This application is a proof-of-concept for learning microservice architecture with Spring Boot. It includes limited features and validations to emphasize architectural patterns and technologies.
- **Environment Files**: In a real-world project, `.env` files containing sensitive configuration (e.g., API keys, database credentials) must **not** be committed to the repository for security reasons. However, in this learning project, the `.env` file is committed to simplify setup and configuration.
- **Docker Frontend**: The Dockerfile for the frontend is configured for local development only. For production, a multi-stage build is required to serve frontend files using a web server (e.g., Nginx or Apache).
- **Config Server**: A configuration server (e.g., Spring Cloud Config) is not used in this project to make it easier to identify which properties belong to each service during the learning phase.

## Technology Stack
The project leverages the following technologies and tools to implement a robust microservice architecture:

- **Spring Boot**: Core framework for building microservices.
  - **Eureka Server**: Service discovery for microservices.
  - **Spring Cloud Gateway**: API gateway for routing and load balancing.
  - **Resilience4J**: Fault tolerance library for circuit breaking and retries.
  - **FeignClient**: Declarative REST client for inter-service communication.
  - **Micrometer Tracing**: Distributed tracing for monitoring requests.
- **Tempo**: Distributed tracing system for observability.
- **Prometheus**: Monitoring and alerting toolkit.
- **Grafana**: Visualization for metrics and logs.
- **Keycloak**: Identity and access management for authentication and authorization.
- **Stripe**: Payment integration for secure transactions.
- **RabbitMQ**: Message broker for asynchronous communication between services.
- **Docker**: Containerization for consistent deployment and scaling.
- **Elastic Search**: Search and analytics engine for efficient salon search functionality.

## Setup Instructions

### Prerequisites
- Git
- Docker
- Java (JDK 17 or later recommended)
- Stripe CLI (for local webhook testing)
- Maven (for building Spring Boot services)
- Node.js (for running the frontend, if applicable)

### Directory Structure Setup
1. **Clone the Repository**  
   Clone the repository to your local machine, replacing `<repository-url>` with the actual repository URL:  
   ```bash
   git clone <repository-url>
   ```

2. **Create Databases Folder and Subfolders**  
   Create a `databases` folder in the project root and add the following subfolders:  
   ```bash
   mkdir -p databases/{bookingservicedb_data,categoryservicedb_data,keycloakdb_data,notificationservicedb_data,paymentservicedb_data,rabbitmq_data,reviewservicedb_data,salonservicedb_data,serviceofferingservicedb_data}
   ```

3. **Create Grafana Folder and Subfolder**  
   Create a `grafana` folder in the project root and add a `data` subfolder:  
   ```bash
   mkdir -p grafana/data
   ```

4. **Create Data Folder in Tempo**  
   Create a `data` folder inside the `tempo` folder:  
   ```bash
   mkdir -p tempo/data
   ```

### Stripe CLI Webhook Configuration (Local)
To configure Stripe CLI for local webhook testing, use the following endpoint:

**Webhook URL:**  
```
http://localhost:8080/api/v1/payments/webhook
```

**Stripe CLI Command:**  
```bash
stripe listen --forward-to http://localhost:8080/api/v1/payments/webhook
```

This command configures the Stripe CLI to listen for webhook events and forward them to the specified local endpoint.

## Running the Application
1. **Build the Project**  
   Use Maven to build the Spring Boot services:  
   ```bash
   mvn clean install
   ```

2. **Run Docker Containers**  
   Start the services using Docker Compose (assuming a `docker-compose.yml` is provided):  
   ```bash
   docker-compose up -d
   ```

3. **Access the Application**  
   Access the following services at their respective URLs:  
   - **Frontend**: `http://localhost:3000/`  
   - **API Gateway (Spring Cloud Gateway)**: `http://localhost:8080`  
   - **Swagger API Documentation**: `http://localhost:8080/swagger-ui/index.html`  
   - **Keycloak**: `http://localhost:8000/`  
   - **Eureka Server 1**: `http://localhost:8761/`  
   - **Eureka Server 2**: `http://localhost:8762/`  
   - **RabbitMQ**: `http://localhost:15672/#/`  
   - **Prometheus**: `http://localhost:9090/query`  
   - **Grafana**: `http://localhost:3001/`  

   Verify service discovery via the Eureka dashboard and monitor metrics and traces using Grafana, Prometheus, and Tempo.

## Contributing
This is a learning project, and contributions are welcome for educational purposes. Feel free to fork the repository, experiment with additional microservices features, or improve the architecture.

## License
This project is for learning purposes and does not include a specific license. Use it responsibly for educational exploration of microservice architecture.

