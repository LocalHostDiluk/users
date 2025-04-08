import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const RABBITMQ_EXCHANGE = "user_event";
const RABBITMQ_ROUTING_KEY = "user.created";

export async function userCreatedEvent(user) {
  try{
    const connection = await amqp.connect({
      protocol: "amqps",  // Cambia de "amqp" a "amqps"
      hostname: process.env.RABBITMQ_HOST,
      port: 5671,  // Usa el puerto para TLS
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASS,
      vhost: process.env.RABBITMQ_VHOST,
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
  } catch (error) {
    console.error("Error conectando a RabbitMQ:", error.message);
    console.error("Reintentando en 5s...");
    setTimeout(userEvents, 5000);
  }
}

export async function passwordRecoveryEvent(data) {
  try {
    const connection = await amqp.connect({
      protocol: 'amqps',
      hostname: process.env.RABBITMQ_URL,
      port: 5671,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBIT_PASS,
      vhost: process.env.RABBITMQ_VHOST
    });

    const channel = await connection.createChannel();

    const exchange = "user_event";
    const routingKey = "user.recover";

    await channel.assertExchange(exchange, "topic", { durable: true });

    const message = JSON.stringify({
      email: data.email,
      subject: "Recuperación de contraseña",
      body: `Hola, has solicitado recuperar tu contraseña. Si no fuiste tú, ignora este mensaje.`
    });

    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log(`[x] Sent recovery to ${data.email}`);

    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error("Error al publicar evento de recuperación:", error);
  }
}
