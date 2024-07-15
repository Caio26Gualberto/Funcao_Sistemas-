using FI.AtividadeEntrevista.DML;
using FI.AtividadeEntrevista.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        private readonly DAL.DaoCliente _daoCliente;
        private readonly DAL.DaoBeneficiario _daoBeneficiario;
        public BoCliente()
        {
            this._daoCliente = new DAL.DaoCliente();
            this._daoBeneficiario = new DAL.DaoBeneficiario();
        }

        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {
            ValidarModeloCliente(cliente);

            var clienteId = _daoCliente.Incluir(cliente);

            foreach (var beneficiario in cliente.Beneficiarios)
            {
                _daoBeneficiario.Incluir(new Beneficiario()
                {
                    CPF = beneficiario.CPF,
                    IdCliente = clienteId,
                    Nome = beneficiario.Nome
                });
            }

            return clienteId;
        }

        private void ValidarModeloCliente(DML.Cliente cliente)
        {
            bool cpfExiste = this.VerificarExistenciaCliente(cliente.CPF, cliente.Id);

            if (cpfExiste)
                throw new ApplicationError($"CPF já cadastrado para o Cliente {cliente.Nome}");

            foreach (var beneficiario in cliente.Beneficiarios)
            {
                cpfExiste = _daoBeneficiario.VerificarExistenciaBeneficiario(beneficiario.CPF, beneficiario.Id);
                cpfExiste = this.VerificarExistenciaCliente(beneficiario.CPF, beneficiario.Id);

                if (cpfExiste)
                {
                    throw new ApplicationError($"CPF já cadastrado para o Beneficiario {beneficiario.Nome}");
                }
            }
        }

        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            var dbCliente = this.Consultar(cliente.Id);
            if (dbCliente == null)
                throw new ApplicationError("Cliente não encontrado");

            ValidarModeloCliente(cliente);

            _daoCliente.Alterar(cliente);

            foreach (var beneficiario in cliente.Beneficiarios)
            {
                if (beneficiario.Id == 0)
                {
                    _daoBeneficiario.Incluir(new Beneficiario()
                    {
                        CPF = beneficiario.CPF,
                        IdCliente = cliente.Id,
                        Nome = beneficiario.Nome
                    });
                }
                else
                {
                    if (dbCliente.Beneficiarios.Any(x => x.Id == beneficiario.Id))
                    {
                        beneficiario.IdCliente = dbCliente.Id;
                        _daoBeneficiario.Alterar(beneficiario);
                    }
                }
            }

            var idsDeBeneficiariosFormulario = cliente.Beneficiarios.Select(x => x.Id).ToList();
            var beneficiariosASeremExcluidos = dbCliente.Beneficiarios.Select(x => x.Id).Where(x => !idsDeBeneficiariosFormulario.Contains(x)).ToList();

            foreach (var id in beneficiariosASeremExcluidos)
            {
                _daoBeneficiario.Excluir(id);
            }
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            var cliente = _daoCliente.Consultar(id);

            if (cliente == null)
                throw new ApplicationError("Cliente não encontrado");

            var beneficiarios = _daoBeneficiario.ConsultarBeneficiariosPorCliente(id);
            cliente.Beneficiarios = beneficiarios;

            return cliente;
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {

            _daoCliente.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {

            return _daoCliente.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {

            return _daoCliente.Pesquisa(iniciarEm, quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistenciaCliente(string CPF, long id)
        {

            return _daoCliente.VerificarExistencia(CPF, id);
        }
    }
}
