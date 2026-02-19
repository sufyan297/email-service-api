import { createTransport } from "nodemailer";

type SendMailType = {
  from: string;
  to: string;
  subject: string;
  text: string;
  user: string;
  pass: string;
};

const SendMail = async (data: SendMailType) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: { user: data.user, pass: data.pass },
    });

    await transporter.sendMail({
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
    });

    return {
      data: {},
      message: "Email Sent Successfully",
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

export { SendMail };
