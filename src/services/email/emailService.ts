import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailToDoctor(data: any) {
  const { name, clinic, service, date, time } = data;

  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  const { error } = await resend.emails.send({
    from: `Agendamentos <${process.env.EMAIL_FROM as string}>`,
    to: [process.env.DOCTOR_EMAIL as string],
    subject: `Novo agendamento - ${data.service}`,
    html: `
      <h2>Novo agendamento</h2>
      <p><strong>Paciente:</strong> ${name}</p>
      <p><strong>Cidade:</strong> ${clinic.city} - ${clinic.state}</p>
      <p><strong>Endereço:</strong> ${clinic.street}, ${clinic.number}, ${clinic.neighborhood}</p>
      <p><strong>CEP:</strong> ${clinic.zip}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Horário:</strong> ${time}</p>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email para doutor:", error);
  }
}

export async function sendEmailToPatient(data: any) {
  const { clinic, service, date, time } = data;

  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  const { error } = await resend.emails.send({
    from: `Agendamentos <${process.env.EMAIL_FROM as string}>`,
    to: data.email,
    subject: "Agendamento confirmado ✅",
    html: `
      <h2>Agendamento confirmado</h2>
      <p><strong>Dra.:</strong> ${process.env.DOCTOR_NAME}</p>
      <p><strong>Cidade:</strong> ${clinic.city} - ${clinic.state}</p>
      <p><strong>Endereço:</strong> ${clinic.street}, ${clinic.number}, ${clinic.neighborhood}</p>
      <p><strong>CEP:</strong> ${clinic.zip}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Horário:</strong> ${time}</p>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email para paciente:", error);
  }
}

export async function sendCancellationEmailToDoctor(data: any) {
  const { name, clinic, service, date, time } = data;

  const formattedDate = new Date(date).toLocaleDateString("pt-BR");

  const { error } = await resend.emails.send({
    from: `Agendamentos <${process.env.EMAIL_FROM as string}>`,
    to: [process.env.DOCTOR_EMAIL as string],
    subject: `Agendamento cancelado - ${formattedDate}`,
    html: `
      <h2 style="color: #c0392b;">Agendamento cancelado ❌</h2>

      <p>O seguinte agendamento foi <strong>cancelado</strong>:</p>

      <hr />

      <p><strong>Paciente:</strong> ${name}</p>
      <p><strong>Serviço:</strong> ${service}</p>
      <p><strong>Data:</strong> ${formattedDate}</p>
      <p><strong>Horário:</strong> ${time}</p>

      <br />

      <p><strong>Cidade:</strong> ${clinic.city} - ${clinic.state}</p>
      <p><strong>Endereço:</strong> ${clinic.street}, ${clinic.number}, ${clinic.neighborhood}</p>
      <p><strong>CEP:</strong> ${clinic.zip}</p>

      <hr />

      <p style="font-size: 12px; color: #777;">
        Este agendamento foi cancelado pelo sistema.
      </p>
    `,
  });

  if (error) {
    console.error(
      "Erro ao enviar email de cancelamento para a doutora:",
      error
    );
  }
}
