import { Resend } from "resend";
import "dotenv/config";
import { parseAddress } from "../../utils/parseAddress";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailToDoctor(data: any) {
  const { enderecoRua, cidade, estado, cep } = parseAddress(data.city);

  const { error } = await resend.emails.send({
    from: "Agendamentos <agendamento@estefanyoliveira.com.br>",
    // to: ["contato@digimig.com.br"],
    to: [process.env.DOCTOR_EMAIL as string],
    subject: `Novo agendamento - ${data.service}`,
    html: `
      <h2>Novo agendamento</h2>
      <p><strong>Paciente:</strong> ${data.name}</p>
      <p><strong>Cidade:</strong> ${cidade} - ${estado}</p>
      <p><strong>Endereço:</strong> ${enderecoRua}</p>
      <p><strong>CEP:</strong> ${cep}</p>
      <p><strong>Service:</strong> ${data.service}</p>
      <p><strong>Data:</strong> ${data.date}</p>
      <p><strong>Horário:</strong> ${data.time}</p>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email para doutor:", error);
  }
}

export async function sendEmailToPatient(data: any) {
  const { enderecoRua, cidade, estado, cep } = parseAddress(data.city);

  const { error } = await resend.emails.send({
    from: "Agendamentos <agendamento@estefanyoliveira.com.br>",
    to: data.email,
    subject: "Agendamento confirmado ✅",
    html: `
      <h2>Agendamento confirmado</h2>
      <p><strong>Cidade:</strong> ${cidade} - ${estado}</p>
      <p><strong>Endereço:</strong> ${enderecoRua}</p>
      <p><strong>CEP:</strong> ${cep}</p>
      <p><strong>Serviço:</strong> ${data.service}</p>
      <p><strong>Data:</strong> ${data.date}</p>
      <p><strong>Horário:</strong> ${data.time}</p>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email para paciente:", error);
  }
}

export async function sendCancellationEmailToDoctor(data: any) {
  const { enderecoRua, cidade, estado, cep } = parseAddress(data.city);

  const { error } = await resend.emails.send({
    from: "Agendamentos <agendamento@estefanyoliveira.com.br>",
    to: [process.env.DOCTOR_EMAIL as string],
    subject: `Agendamento cancelado - ${data.service}`,
    html: `
      <h2 style="color: #c0392b;">Agendamento cancelado ❌</h2>

      <p>O seguinte agendamento foi <strong>cancelado</strong>:</p>

      <hr />

      <p><strong>Paciente:</strong> ${data.name}</p>
      <p><strong>Serviço:</strong> ${data.service}</p>
      <p><strong>Data:</strong> ${data.date}</p>
      <p><strong>Horário:</strong> ${data.time}</p>

      <br />

      <p><strong>Cidade:</strong> ${cidade} - ${estado}</p>
      <p><strong>Endereço:</strong> ${enderecoRua}</p>
      <p><strong>CEP:</strong> ${cep}</p>

      <hr />

      <p style="font-size: 12px; color: #777;">
        Este agendamento foi cancelado pelo sistema.
      </p>
    `,
  });

  if (error) {
    console.error("Erro ao enviar email de cancelamento para a doutora:", error);
  }
}
