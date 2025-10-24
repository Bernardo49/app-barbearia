// Templates de email em português de Portugal com design profissional
import { AppointmentEmailData } from './email';

// Função auxiliar para formatar data em português
function formatPortugueseDate(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-PT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Template base com design profissional
function getBaseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barbearia Torres Vedras</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f7f7f8;
            color: #111827;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #1E3A8A;
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .appointment-card {
            background-color: #f7f7f8;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #1E3A8A;
        }
        .appointment-detail {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .appointment-detail:last-child {
            border-bottom: none;
            font-weight: bold;
            color: #1E3A8A;
        }
        .label {
            font-weight: 600;
            color: #6b7280;
        }
        .value {
            color: #111827;
        }
        .footer {
            background-color: #f7f7f8;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
        }
        .button {
            display: inline-block;
            background-color: #1E3A8A;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
        .alert {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
        .success {
            background-color: #f0fdf4;
            border: 1px solid #bbf7d0;
            color: #166534;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Barbearia Torres Vedras</h1>
            <p>Tradição e qualidade desde sempre</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p><strong>Barbearia Torres Vedras</strong></p>
            <p>📍 Torres Vedras, Portugal</p>
            <p>📞 Contacto: +351 XXX XXX XXX</p>
            <p>🌐 www.agendamento24.pt</p>
            <p style="margin-top: 15px; font-size: 12px;">
                Este email foi enviado automaticamente pelo sistema de agendamento.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

// Template de confirmação de marcação
export function getConfirmationEmailTemplate(data: AppointmentEmailData): string {
  const content = `
    <h2>Marcação Confirmada! ✅</h2>
    <p>Olá <strong>${data.clientName}</strong>,</p>
    <p>A sua marcação foi registada com sucesso. Aqui estão os detalhes:</p>
    
    <div class="appointment-card">
        <div class="appointment-detail">
            <span class="label">Serviço:</span>
            <span class="value">${data.serviceName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Barbeiro:</span>
            <span class="value">${data.barberName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Data:</span>
            <span class="value">${formatPortugueseDate(data.date)}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Hora:</span>
            <span class="value">${data.time}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Preço:</span>
            <span class="value">${data.price}€</span>
        </div>
    </div>
    
    <div class="success">
        <strong>✅ Marcação confirmada!</strong><br>
        Receberá um lembrete 24 horas antes da sua marcação.
    </div>
    
    <p>Se precisar de alterar ou cancelar a sua marcação, entre em contacto connosco.</p>
    <p>Obrigado pela sua preferência!</p>
    
    <p style="margin-top: 30px;">
        <strong>Equipa Barbearia Torres Vedras</strong>
    </p>
  `;
  
  return getBaseTemplate(content);
}

// Template de lembrete 24h antes
export function getReminderEmailTemplate(data: AppointmentEmailData): string {
  const content = `
    <h2>Lembrete da sua marcação 📅</h2>
    <p>Olá <strong>${data.clientName}</strong>,</p>
    <p>Este é um lembrete de que tem uma marcação <strong>amanhã</strong> na nossa barbearia:</p>
    
    <div class="appointment-card">
        <div class="appointment-detail">
            <span class="label">Serviço:</span>
            <span class="value">${data.serviceName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Barbeiro:</span>
            <span class="value">${data.barberName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Data:</span>
            <span class="value">${formatPortugueseDate(data.date)}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Hora:</span>
            <span class="value">${data.time}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Preço:</span>
            <span class="value">${data.price}€</span>
        </div>
    </div>
    
    <p><strong>⏰ Não se esqueça!</strong> A sua marcação é amanhã às <strong>${data.time}</strong>.</p>
    
    <p>Se não puder comparecer, por favor contacte-nos com antecedência para remarcar.</p>
    
    <p>Aguardamos a sua visita!</p>
    
    <p style="margin-top: 30px;">
        <strong>Equipa Barbearia Torres Vedras</strong>
    </p>
  `;
  
  return getBaseTemplate(content);
}

// Template para notificar o dono sobre nova marcação
export function getNewAppointmentEmailTemplate(data: AppointmentEmailData): string {
  const content = `
    <h2>Nova Marcação Recebida! 🎉</h2>
    <p>Foi registada uma nova marcação no sistema:</p>
    
    <div class="appointment-card">
        <div class="appointment-detail">
            <span class="label">Cliente:</span>
            <span class="value">${data.clientName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Serviço:</span>
            <span class="value">${data.serviceName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Barbeiro:</span>
            <span class="value">${data.barberName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Data:</span>
            <span class="value">${formatPortugueseDate(data.date)}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Hora:</span>
            <span class="value">${data.time}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Valor:</span>
            <span class="value">${data.price}€</span>
        </div>
    </div>
    
    <p>Aceda ao painel administrativo para gerir esta marcação:</p>
    <a href="https://www.agendamento24.pt/admin" class="button">
        Aceder ao Painel Admin
    </a>
    
    <p style="margin-top: 30px;">
        <strong>Sistema de Agendamento</strong><br>
        Barbearia Torres Vedras
    </p>
  `;
  
  return getBaseTemplate(content);
}

// Template de cancelamento
export function getCancellationEmailTemplate(data: AppointmentEmailData): string {
  const content = `
    <h2>Marcação Cancelada ❌</h2>
    <p>Olá <strong>${data.clientName}</strong>,</p>
    <p>Informamos que a sua marcação foi cancelada:</p>
    
    <div class="appointment-card">
        <div class="appointment-detail">
            <span class="label">Serviço:</span>
            <span class="value">${data.serviceName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Barbeiro:</span>
            <span class="value">${data.barberName}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Data:</span>
            <span class="value">${formatPortugueseDate(data.date)}</span>
        </div>
        <div class="appointment-detail">
            <span class="label">Hora:</span>
            <span class="value">${data.time}</span>
        </div>
    </div>
    
    ${data.cancelReason ? `
    <div class="alert">
        <strong>Motivo do cancelamento:</strong><br>
        ${data.cancelReason}
    </div>
    ` : ''}
    
    <p>Lamentamos qualquer inconveniente causado.</p>
    <p>Para fazer uma nova marcação, visite o nosso site:</p>
    
    <a href="https://www.agendamento24.pt" class="button">
        Fazer Nova Marcação
    </a>
    
    <p>Se tiver alguma questão, não hesite em contactar-nos.</p>
    
    <p style="margin-top: 30px;">
        <strong>Equipa Barbearia Torres Vedras</strong>
    </p>
  `;
  
  return getBaseTemplate(content);
}