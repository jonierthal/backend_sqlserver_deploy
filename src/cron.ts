import { CronJob } from 'cron';
import moment from 'moment-timezone';
import { exec, ExecException } from 'child_process';

// Configuração do cron job
// Cria um objeto CronJob que dispara às 24:00 no horário local de Brasília todos os dias
export function Cron(){
    
    const job = new CronJob('00 00 * * *', () => {
    console.log(`Reiniciando o servidor às ${moment().tz('America/Sao_Paulo').format('HH:mm:ss')}`);
  
    // Insira aqui o código para reinicializar o servidor
    exec('npm start', (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        console.log(`Erro ao reiniciar o servidor: ${err}`);
        return;
      }
      console.log(stdout);
    });
  }, null, true, 'America/Sao_Paulo');
  
  console.log('CronJob iniciado!',job);
// ...
}


