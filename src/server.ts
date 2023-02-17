import express, {Request, Response} from 'express';
import { Sequelize } from 'sequelize';

const Funcionario = require('../models').Funcionario
const CadastroAlmoco = require('../models').CadastroAlmoco
const AlmExt = require('../models').AlmExt
const ReservaXis = require('../models').Reserva_Xis
const hoje = new Date().toISOString().slice(0, 19).replace('T', ' ');


//Ligação com o banco de dados
const sequelize = new Sequelize(
    'REG_ALM',
    'admin_pcr',
    '6TnkGkJ527HJFQP*',
     {
       host: 'dbpcr.database.windows.net',
       dialect: 'mssql',
       timezone: 'America/Sao_Paulo',
       dialectOptions: {
        options: {
            schema: 'dbo'
        }
       }
   });

   //Autenticação do banco, e retorno do status de conexão
   sequelize.authenticate().then(() => {
    console.log('Db connection OK!');
    }).catch(e => {
        console.log('Db connection error', e);
    })

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://192.168.0.54');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });

interface Almoco {
    cod_funcionario: number;
    funcionarios: {
      nome: string;
    };
  }

    app.post('/cadastro', async (req: Request, res: Response) => {
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
    
    app.post('/alm_ext', async(req: Request, res: Response) => {
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

    app.post('/reserva_xis', async (req: Request, res: Response) => {
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
  app.get('/cadastro', async (req: Request, res: Response) => {
    console.log('GET');

    const pesquisaFuncionario = await Funcionario.findAll({
        order: [['nome','ASC']]
    })
    res.json({pesquisaFuncionario})
})

    //retorna id,cod_funcionario,nome quando o confirma estiver como 1 e a data for a data atual
    app.get('/almocos', (req: Request, res: Response) => {
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

    app.get('/alm_ext', (req, res) => {
        AlmExt.findAll({
          attributes: ['id','nome_aext','quantidade_aext'],
          where: {
           date_aext: hoje
          },
        }).then((alm_ext: Almoco[]) => {
          res.send({alm_ext});
        });
      });
    
      app.get('/reserva_xis', (req, res) => {
        ReservaXis.findAll({
          attributes: ['id','nome_rx','quantidade_rx'],
          where: {
            data_rx: hoje
          },
        }).then((reserva_xis: Almoco[]) => {
          res.send({reserva_xis});
        });
      });
    
    sequelize.sync({ force: true }).then(() => {
        console.log('Tabelas sincronizadas com sucesso');
      });

app.listen(8000, () => {
    console.log('server running');
})