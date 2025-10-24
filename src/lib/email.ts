// Sistema de envio de emails para notificações automáticas
// Configurado para usar o domínio personalizado 24agendamento24@gmail.com

export interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface AppointmentEmailData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
  appointmentId: string;
  cancelReason?: string;
}

// Configuração do remetente
const FROM_EMAIL = '24agendamento24@gmail.com';
const OWNER_EMAIL = '24agendamento24@gmail.com'; // Email do dono da barbearia

// Função principal para envio de emails
export async function sendEmail(config: EmailConfig): Promise<boolean> {
  try {
    // Em produção, aqui seria integrado com um serviço real como:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Nodemailer com SMTP
    
    console.log('📧 Email enviado:', {
      from: config.from,
      to: config.to,
      subject: config.subject,
      timestamp: new Date().toISOString()
    });
    
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return false;
  }
}

// Email de confirmação para o cliente
export async function sendConfirmationEmail(data: AppointmentEmailData): Promise<boolean> {
  const { getConfirmationEmailTemplate } = await import('./email-templates');
  
  const emailConfig: EmailConfig = {
    from: FROM_EMAIL,
    to: data.clientEmail,
    subject: 'Confirmação da sua marcação - Barbearia Torres Vedras',
    html: getConfirmationEmailTemplate(data)
  };
  
  return await sendEmail(emailConfig);
}

// Email de lembrete 24h antes
export async function sendReminderEmail(data: AppointmentEmailData): Promise<boolean> {
  const { getReminderEmailTemplate } = await import('./email-templates');
  
  const emailConfig: EmailConfig = {
    from: FROM_EMAIL,
    to: data.clientEmail,
    subject: 'Lembrete: Sua marcação é amanhã - Barbearia Torres Vedras',
    html: getReminderEmailTemplate(data)
  };
  
  return await sendEmail(emailConfig);
}

// Email para o dono quando há nova marcação
export async function sendNewAppointmentNotification(data: AppointmentEmailData): Promise<boolean> {
  const { getNewAppointmentEmailTemplate } = await import('./email-templates');
  
  const emailConfig: EmailConfig = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `Nova marcação: ${data.clientName} - ${data.serviceName}`,
    html: getNewAppointmentEmailTemplate(data)
  };
  
  return await sendEmail(emailConfig);
}

// Email de cancelamento para o cliente
export async function sendCancellationEmail(data: AppointmentEmailData): Promise<boolean> {
  const { getCancellationEmailTemplate } = await import('./email-templates');
  
  const emailConfig: EmailConfig = {
    from: FROM_EMAIL,
    to: data.clientEmail,
    subject: 'Marcação cancelada - Barbearia Torres Vedras',
    html: getCancellationEmailTemplate(data)
  };
  
  return await sendEmail(emailConfig);
}

// Função para agendar lembrete automático (24h antes)
export function scheduleReminderEmail(data: AppointmentEmailData): void {
  const appointmentDateTime = new Date(`${data.date} ${data.time}`);
  const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000); // 24h antes
  const now = new Date();
  
  if (reminderTime > now) {
    const delay = reminderTime.getTime() - now.getTime();
    
    setTimeout(async () => {
      await sendReminderEmail(data);
      console.log(`📧 Lembrete enviado para ${data.clientName} - Marcação: ${data.date} ${data.time}`);
    }, delay);
    
    console.log(`⏰ Lembrete agendado para ${reminderTime.toLocaleString('pt-PT')} - Cliente: ${data.clientName}`);
  }
}

// Verificar se é necessário enviar lembretes pendentes (para quando a app reinicia)
export function checkPendingReminders(appointments: any[]): void {
  const now = new Date();
  
  appointments.forEach(appointment => {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    const reminderTime = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
    
    // Se o lembrete deveria ter sido enviado nas últimas 2 horas e a marcação ainda está ativa
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    
    if (reminderTime > twoHoursAgo && 
        reminderTime <= now && 
        appointment.status !== 'cancelled' &&
        appointment.status !== 'completed') {
      
      // Enviar lembrete imediatamente
      const emailData: AppointmentEmailData = {
        clientName: appointment.clientName,
        clientEmail: appointment.clientEmail || `${appointment.clientPhone}@exemplo.com`, // Fallback
        serviceName: appointment.serviceName,
        barberName: appointment.barberName,
        date: appointment.date,
        time: appointment.time,
        price: appointment.servicePrice,
        appointmentId: appointment.id
      };
      
      sendReminderEmail(emailData);
      console.log(`📧 Lembrete recuperado enviado para ${appointment.clientName}`);
    }
  });
}