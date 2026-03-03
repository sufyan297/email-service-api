import { createTransport } from "nodemailer";

type SendMailType = {
  from: string;
  to: string;
  subject: string;
  html: string;
  headers?:
    | { [key: string]: string | string[] | { prepared: boolean; value: string } }
    | Array<{ key: string; value: string }>;
  user: string;
  pass: string;
  host: string;
  port: number;
  tls: "off" | "start-tls" | "ssl/tls";
  authProtocol: "LOGIN" | "PLAIN" | "CRAM";
  maxConnection: number;
};

const SendMail = (data: SendMailType) => {
  try {
    const transporter = createTransport({
      auth: { user: data.user, pass: data.pass },
      host: data.host,
      port: data.port,
      headers: data.headers,
      secure: data.tls === "off",
      ignoreTLS: data.tls === "off",
      opportunisticTLS: data.tls !== "off",
      authMethod: data.authProtocol,
    });

    transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { SendMail };
