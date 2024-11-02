## Description

There are 2 microservices communicating over kafka.

Each microservice is developed by nestjs, graphql, postgresql

Microservice account listens to localhost:3000 while microservice project listens to localhost:5001

Microservice project will check if a user is logged in or not via graphql communication to microservice account.



<b>Short description:</b>

User A creates an account and login with his credential via JWT token.

He subscribes new project via graphql subscription.

User B creates an account and login.

User B creates a project and user A will subscribe his project.


## How to test

Unfortunately, postman doesn't support WebSocket or subscription queries. so tested using GraphQL playground
- Create user: <a target = "_blank">https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/create_user.png </a>
- Login: <a target = "_blank">https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/login.png</a>
- Subscribe new project: <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/subscribe_project_creation.png </a>
- Create new project: <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/login.png </a>
- Check subscription : <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/subscribe_project.png </a>
- Check kafka communication: <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/kafka_drop.png </a>
- Table User - <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/db_user.png </a>
- Table Project - <a target = "_blank"> https://github.com/mariocasila/nest-microservice-kafka-postgres/tree/main/images/db_project.png </a>


## Support

## Stay in touch

- Author - [Mario Casila]
- Email - maria.casila.94@gmail.com

## License
