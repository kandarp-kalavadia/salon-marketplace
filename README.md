=>Get Clone of this repo 
=>Create **databases** folder and inside it create folders
    **bookingservicedb_data  
   categoryservicedb_data  
   keycloakdb_data  
   notificationservicedb_data  
   paymentservicedb_data  
   rabbitmq_data  
   reviewservicedb_data  
   salonservicedb_data  
   serviceofferingservicedb_data**

=> Create  **grafana** folder and inside it create  folder\n
    **data** 

=> create **data** folder inside **tempo** folder


=============================================================================

for stripe cli webhook config for local 

http://localhost:8080/api/v1/payments/webhook


stripe listen --forward-to http://localhost:8080/api/v1/payments/webhook
