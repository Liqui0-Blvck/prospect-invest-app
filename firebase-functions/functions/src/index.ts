import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import * as sgMail from '@sendgrid/mail';
import * as sgClient from '@sendgrid/client';

initializeApp();

// Configura SendGrid con la API Key

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);



export const sendEmail = onRequest(async (req, res) => {
  const { to, subject, text, user } = req.body;

  // Validación de campos obligatorios
  if (!to || !subject || !text || !user?.email || !user?.nombre) {
    console.error('Error: Faltan campos obligatorios en la solicitud');
    res.status(400).json({ success: false, error: 'Faltan campos obligatorios en la solicitud' });
    return;
  }

  const msg = {
    to, // Destinatario
    from: 'nicolasmacgwrk@gmail.com', // Cambia a tu remitente verificado en SendGrid
    subject,
    templateId: 'd-5f632933d3404dd38d6d7d753aa379f4',
    dynamic_template_data: {
      subject,
      text,
      user: {
        email: user.email,
        nombre: user.nombre,
      },
    },
    replyTo: user.email,
  };

  try {
    await sgMail.send(msg);
    console.log('Correo enviado a:', to);
    res.status(200).json({ success: true, message: 'Correo enviado exitosamente' });
  } catch (error: any) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
})


export const getSendGridTemplates = onRequest(async (req, res) => {
  try {
    const request = {
      url: `/v3/templates`,
      method: "GET" as const, // Especificamos el tipo aquí
      qs: { page_size: 18 },
    };

    const [response, body] = await sgClient.request(request);

    console.log(response, body);

    res.status(response.statusCode).json(body);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).send({ error: "Failed to fetch templates" });
  }
});