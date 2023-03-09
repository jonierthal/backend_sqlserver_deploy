import  {Request, Response} from 'express';
import { appExpress } from './app';
import { sequelizeCon } from './config';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

//classes
const Funcionario = require('../models').Funcionario
const CadastroAlmoco = require('../models').CadastroAlmoco
const AlmExt = require('../models').AlmExt
const ReservaXis = require('../models').Reserva_Xis

moment.tz.setDefault('America/Sao_Paulo');
const agora = moment();
const hoje = agora.format('YYYY-MM-DDTHH:mm:ssZ');

interface Almoco {
    cod_funcionario: number;
    funcionarios: {
      nome: string;
    };
  }

//REQUISIÇOES POST
appExpress.post('/cadastro', async (req: Request, res: Response) => {
  console.log('POST');
  const cadastroAlmoco = req.body;
  console.log(cadastroAlmoco);
  if (cadastroAlmoco) {
    console.log('CADASTRO')
    try {
      const existingCadastro = await CadastroAlmoco.findOne({
        where: {
          cod_funcionario: cadastroAlmoco.codFuncionario,
          data_cadastro: cadastroAlmoco.dataCadastro
        }
      });

      if (existingCadastro) {
        res.status(400).json({ message: 'Este funcionário já efetuou a reserva do almoço'});
      } else {
        const cadastro = await CadastroAlmoco.create({
          cod_funcionario: cadastroAlmoco.codFuncionario,
          confirma: cadastroAlmoco.confirma,
          data_cadastro: cadastroAlmoco.dataCadastro
        });

        res.json({
          cod_funcionario: cadastro.cod_funcionario,
          confirma: cadastro.confirma
        });
      }
    } catch (error) {
      res.status(500).json({ message: 'Falha ao cadastrar' });
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
              const existingCadastro = await ReservaXis.findOne({
                where: {
                  cod_funcionario: reservaXis.cod_funcionario,
                  date_rx: reservaXis.date_rx
                }
              });

                if(existingCadastro) {
                  res.status(400).json({ message: 'Este funcionário já efetuou a reserva do xis'});
                } else {
                  const reserva_xis = await ReservaXis.create({
                    cod_funcionario: reservaXis.cod_funcionario,
                    quantidade_rx: reservaXis.quantidade_rx,
                    date_rx: reservaXis.date_rx
                });

                res.json({
                    cod_funcionario: reserva_xis.cod_funcionario,
                    quantidade_rx: reserva_xis.quantidade_rx,
                    date_rx: reserva_xis.date_rx
                });
              }
            }catch(error){
                res.status(8000).json({message: 'Falha ao cadastrar'})
                console.log(error);
            }
        }
    })

//REQUISIÇOES GET/
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
          attributes: ['id','cod_funcionario','quantidade_rx'],
          where: {
            date_rx: hoje
          },
          include: [{
            model: Funcionario,
            attributes: ['nome'],
        }],
        raw: true
        }).then((reserva_xis: Almoco[]) => {
          res.send({reserva_xis});
        });
      });

      appExpress.get('/retorno_rel', async(req, res) => {
        let startDate: string;
        let endDate: string;

        startDate = req.query.startDate as string;
        endDate = req.query.endDate as string; 
        
        const startDateString = new Date(Date.parse(startDate));
        const endDateString = new Date(Date.parse(endDate));

        const funcionarios = await Funcionario.findAll({
            attributes: [
              'nome',
              [sequelizeCon.fn('COUNT', sequelizeCon.col('CadastroAlmocos.id')), 'quantidade'],
              'id'
            ],
            include: {
              model: CadastroAlmoco,
              where: {
                data_cadastro: {
                  [Op.between]: [startDate, endDate]
                },
                confirma: true
              },
              attributes: []
            },
            group: 'Funcionario.nome'
          });

        const almExts = await AlmExt.findAll({
            where: {
            date_aext: {
                [Op.between]: [startDate, endDate]
            }
            },
            attributes: ['nome_aext', 'quantidade_aext']
          });
          
          const startDateFormatted = moment(startDateString).format('YYYY-MM-DD');
          const endDateFormatted = moment(endDateString).format('YYYY-MM-DD');

          console.log("Data não formatada", startDateString)
          console.log("Data Formatada", startDateFormatted)

        const total = await CadastroAlmoco.findOne({
            attributes: [
              [sequelizeCon.literal(
                `COUNT(id) + COALESCE((
                  SELECT SUM(quantidade_aext)
                  FROM AlmExts
                  WHERE date_aext BETWEEN '${startDateFormatted}' AND '${endDateFormatted}'
                ), 0)
                `), 'quantidade_total']
              ],
            where: {
              data_cadastro: {
                [Op.between]: [startDate, endDate]
              },
              confirma: true
            }
          });    

          res.json({ funcionarios, almExts, total });
          
      });

      
    

