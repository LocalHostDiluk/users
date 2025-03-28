import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
  const connection = await amqp.connect({
    protocol: "amqp",
    hostname: process.env.RABBITMQ_HOST,
    port: 5672,
    username: process.env.RABBITMQ_USER,
    password: process.env.RABBITMQ_PASS
  });
  const channel = await connection.createChannel();

  //Declare exchange
  await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });

  //Publicar el evento
  const message = JSON.stringify(user);
  channel.publish(
    RABBITMQ_EXCHANGE,
    RABBITMQ_ROUTING_KEY,
    Buffer.from(message)
  );

  console.log(
    `[x] exchange "${RABBITMQ_EXCHANGE}", routing key "${RABBITMQ_ROUTING_KEY}": ${message}`
  );

  setTimeout(() => {
    connection.close();
  }, 500);
}
