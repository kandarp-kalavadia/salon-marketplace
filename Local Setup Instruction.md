# Project Setup Instructions

## Directory Structure Setup

1. **Clone the Repository**  
   Clone the repository to your local machine by replacing `<repository-url>` with the actual repository URL.  
   ```bash
   git clone <repository-url>
   
2. **Create Databases Folder and Subfolders**
   Create a `databases` folder in the root directory and add the following subfolders:
   ```bash
   mkdir -p databases/{bookingservicedb_data,categoryservicedb_data,keycloakdb_data,notificationservicedb_data,paymentservicedb_data,rabbitmq_data,reviewservicedb_data,salonservicedb_data,serviceofferingservicedb_data}
   ```

3. **Create Grafana Folder and Subfolder**
   Create a `grafana` folder in the root directory and add a `data` subfolder:
   ```bash
   mkdir -p grafana/data
   ```

4. **Create Data Folder in Tempo**
   Create a `data` folder inside the `tempo` folder:
   ```bash
   mkdir -p tempo/data
   ```

## Stripe CLI Webhook Configuration (Local)

To configure Stripe CLI for local webhook testing, use the following endpoint:

**Webhook URL:**
```
http://localhost:8080/api/v1/payments/webhook
```

**Stripe CLI Command:**
```bash
stripe listen --forward-to http://localhost:8080/api/v1/payments/webhook
```

This command sets up the Stripe CLI to listen for webhook events and forward them to the specified local endpoint.
```

