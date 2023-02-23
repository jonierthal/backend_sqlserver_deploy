import  {Request, Response} from 'express';
import { appExpress } from './app';
import moment from 'moment-timezone';

//classes
const Funcionario = require('../models').Funcionario
const CadastroAlmoco = require('../models').CadastroAlmoco
const AlmExt = require('../models').AlmExt
const ReservaXis = require('../models').Reserva_Xis

moment.tz.setDefault('America/Sao_Paulo');
const agora = moment();
const hoje = agora.format('YYYY-MM-DD HH:mm:ss');


interface Almoco {
    cod_funcionario: number;
    funcionarios: {
      nome: string;
    };
  }

    appExpress.post('/cadastro', async (req: Request, res: Response) => {
        console.log('POST');
        const cadastroAlmoco = req.body;
        console.log(cadastroAlmoco);
        if(cadastroAlmoco) {
            console.log('CADASTRO')
            try{
                const cadastro = await CadastroAlmoco.create({
                    cod_funcionario: cadastroAlmoco.codFuncionario,
                    confirma: cadastroAlmoco.confirma,
                    data_cadastro: cadastroAlmoco.dataCadastro
                });
                res.json({
                    cod_funcionario: cadastro.cod_funcionario,
                    confirma: cadastro.confirma
                });
            }catch(error){
                res.status(8000).json({message: 'Falha ao cadastrar'})
                console.log(error);
            }
        }
    })
    
    appExpress.post('/alm_ext', async(req: Request, res: Response) => {
        console.log('POST');
        const almocoExtra = req.body;
        console.log("infos:",almocoExtra);
        if(almocoExtra){
            console.log('CADASTRO', almocoExtra)
            try{
                const almoco_extra = await AlmExt.create({
                    nome_aext: almocoExtra.nome_aext,
                    quantidade_aext: almocoExtra.quantidade_aext,
                    date_aext: almocoExtra.dataAext
                });
                res.json([{
                    nome_aext: almoco_extra.nome_aext,
                    quantidade_aext: almoco_extra.quantidade_aext,
                    data_aext: almoco_extra.dataAext
                }]);
            }catch(error){
                res.status(8000).json({message: 'Falha ao cadastrar'})
                console.log(error);
            }
        } else {
            console.log("Não foi possível cadastrar")
        }
    })

    appExpress.post('/reserva_xis', async (req: Request, res: Response) => {
        console.log('POST');
        const reservaXis = req.body;
        console.log(reservaXis);
        if(reservaXis) {
            console.log('CADASTRO', reservaXis)
            try{
                const reserva_xis = await ReservaXis.create({
                    nome_rx: reservaXis.nome_rx,
                    quantidade_rx: reservaXis.quantidade_rx,
                    data_rx: reservaXis.data_rx
                });
                res.json({
                    nome_rx: reserva_xis.nome_rx,
                    quantidade_rx: reserva_xis.quantidade_rx,
                    data_rx: reserva_xis.data_rx
                });
            }catch(error){
                res.status(8000).json({message: 'Falha ao cadastrar'})
                console.log(error);
            }
        }
    })
    
    //retorna o id e nome do funcionário
  appExpress.get('/cadastro', async (req: Request, res: Response) => {
    console.log('GET');

    const pesquisaFuncionario = await Funcionario.findAll({
        order: [['nome','ASC']]
    })
    res.json({pesquisaFuncionario})
})

    //retorna id,cod_funcionario,nome quando o confirma estiver como 1 e a data for a data atual
    appExpress.get('/almocos', (req: Request, res: Response) => {
        CadastroAlmoco.findAll({
        attributes: ['id','cod_funcionario'],
        where: {
           confirma: 1,
           data_cadastro: hoje
        },
        include: [{
            model: Funcionario,
            attributes: ['nome'],
        }],
        raw: true
        }).then((almocos: Almoco[]) => {
        const num_almocos = almocos.length;
        res.send({num_almocos,almocos});
        });
    });

    appExpress.get('/alm_ext', (req, res) => {
        AlmExt.findAll({
          attributes: ['id','nome_aext','quantidade_aext'],
          where: {
           date_aext: hoje
          },
        }).then((alm_ext: Almoco[]) => {
          res.send({alm_ext});
        });
      });
    
      appExpress.get('/reserva_xis', (req, res) => {
        ReservaXis.findAll({
          attributes: ['id','nome_rx','quantidade_rx'],
          where: {
            data_rx: hoje
          },
        }).then((reserva_xis: Almoco[]) => {
          res.send({reserva_xis});
        });
      });
    

