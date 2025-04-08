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

export async function userRecoverEvent(data) {
    try {
        if (!RABBITMQ_URL) {
            throw new Error("❌ No se encontró la variable RABBITMQ_URL en el entorno.");
        }

        console.log("🔌 Conectando a RabbitMQ...");
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertExchange(RABBITMQ_EXCHANGE, "topic", { durable: true });

        await channel.assertQueue(QUEUE_RECOVER, { durable: true });
        await channel.bindQueue(QUEUE_RECOVER, RABBITMQ_EXCHANGE, ROUTING_KEY_RECOVER);

        const message = JSON.stringify(data);
        channel.publish(RABBITMQ_EXCHANGE, ROUTING_KEY_RECOVER, Buffer.from(message));

        console.log(`✅ Evento de recuperación enviado: ${message}`);

        setTimeout(() => {
            connection.close();
            console.log("🔌 Conexión cerrada.");
        }, 500);
        
    } catch (error) {
        console.error("❌ Error publicando el evento de recuperación:", error.message);
    }
}
